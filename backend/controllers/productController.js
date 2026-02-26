const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const { clearCache } = require('../middleware/cache');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const {
            category,
            gender,
            color,
            size,
            material,
            brand,
            minPrice,
            maxPrice,
            sort,
            search,
            page = 1,
            limit = 12,
        } = req.query;

        // Build query object
        const query = {};

        // Category filter (can be comma-separated)
        if (category) {
            const categoryArray = category.split(',');
            // Match exact category OR any category that contains the search term (to handle sub-categories/hierarchy)
            query.category = {
                $in: categoryArray.map(cat => new RegExp(cat, 'i'))
            };
        }

        // Gender filter
        if (gender) {
            query.gender = gender;
        }

        // Material filter
        if (material) {
            query.material = { $in: material.split(',') };
        }

        // Brand filter (can be comma-separated)
        if (brand) {
            query.brand = { $in: brand.split(',') };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.basePrice = {};
            if (minPrice) query.basePrice.$gte = Number(minPrice);
            if (maxPrice) query.basePrice.$lte = Number(maxPrice);
        }

        // Source variant mapping for size and color
        if (size || color) {
            const variantQuery = {};
            if (color) variantQuery.color = { $regex: new RegExp(`^(${color.split(',').join('|')})$`, 'i') }; // case insensitive
            if (size) {
                const sizeArray = size.split(',');
                // More flexible size matching (handles potential variations better)
                variantQuery.size = { $in: sizeArray.map(s => new RegExp(`^${s.trim()}$`, 'i')) };
            }

            // Optional: you can choose whether variant must be in stock or not for filter to match
            // variantQuery.countInStock = { $gt: 0 };

            const matchingVariants = await ProductVariant.find(variantQuery).select('product_id');
            const productIdsFromVariants = matchingVariants.map(v => v.product_id);

            if (productIdsFromVariants.length === 0) {
                // Short circuit if no variants match the size/color filters
                return res.json({ products: [], page: page, pages: 0, total: 0 });
            }

            // Assign to query id
            query._id = { $in: productIdsFromVariants };
        }

        // Search by name or SKU
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ];
        }

        // Build sort object
        let sortObj = { createdAt: -1 }; // Default: newest first
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    sortObj = { basePrice: 1 };
                    break;
                case 'price_desc':
                    sortObj = { basePrice: -1 };
                    break;
                case 'name_asc':
                    sortObj = { name: 1 };
                    break;
                case 'name_desc':
                    sortObj = { name: -1 };
                    break;
                case 'rating':
                    sortObj = { rating: -1 };
                    break;
                default:
                    sortObj = { createdAt: -1 };
            }
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const products = await Product.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limitNum);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
    try {
        const products = await Product.find({ isNewArrival: true })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true })
            .sort({ createdAt: -1 })
            .limit(8);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        let product;

        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
        } else {
            // First try exact slug match
            product = await Product.findOne({ slug: id.toLowerCase() });

            // Fallback to name search if not found by slug
            if (!product) {
                product = await Product.findOne({
                    name: { $regex: id, $options: 'i' }
                });
            }
        }

        if (product) {
            const variants = await ProductVariant.find({ product_id: product._id });
            const productWithVariants = { ...product.toObject(), variants };
            res.json(productWithVariants);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isNewArrival,
            tags,
            sku,
            dimensions,
            weight,
            metaTitle,
            metaDescription,
            metaKeywords,
            bestFit,
        } = req.body;

        // No longer relying on Category ObjectId ref

        const product = new Product({
            name,
            description,
            basePrice: price, // mapping from price payload
            discountPrice,
            category, // Now a string
            brand,
            collections,
            material,
            gender,
            sku,
            images: images || [],
            isFeatured: isFeatured || false,
            isNewArrival: isNewArrival || false,
            tags: tags || [],
            user: req.user._id,
            dimensions,
            weight,
            metaTitle,
            metaDescription,
            metaKeywords,
            bestFit,
        });

        const createdProduct = await product.save();

        if (req.body.variantStock) {
            for (const [size, numStock] of Object.entries(req.body.variantStock)) {
                await ProductVariant.create({
                    product_id: createdProduct._id,
                    size,
                    color: colors && colors.length > 0 ? colors[0] : 'Default',
                    countInStock: parseInt(numStock) || 0,
                    sku: `${createdProduct.slug}-${size}`.toLowerCase(),
                });
            }
        }

        // Invalidate cache
        await clearCache('products_*')();
        await clearCache('product_detail:*')();

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Using string category, no ref populate logic needed

            Object.assign(product, req.body);
            const updatedProduct = await product.save();

            if (req.body.variantStock) {
                // Delete existing ones
                await ProductVariant.deleteMany({ product_id: product._id });
                // Recreate them
                for (const [size, numStock] of Object.entries(req.body.variantStock)) {
                    await ProductVariant.create({
                        product_id: product._id,
                        size,
                        color: req.body.colors && req.body.colors.length > 0 ? req.body.colors[0] : 'Default',
                        countInStock: parseInt(numStock) || 0,
                        sku: `${product.slug}-${size}`.toLowerCase(),
                    });
                }
            }

            // Invalidate cache
            await clearCache('products_*')();
            await clearCache('product_detail:*')();

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await ProductVariant.deleteMany({ product_id: req.params.id });
            await Product.deleteOne({ _id: req.params.id });

            // Invalidate cache
            await clearCache('products_*')();
            await clearCache('product_detail:*')();

            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let relatedProducts = [];

        // 1. Same Category
        if (product.category) {
            relatedProducts = await Product.find({
                category: product.category,
                _id: { $ne: product._id }
            }).limit(4);
        }

        // 2. If not enough, try tags or collections (placeholder logic for now)
        if (relatedProducts.length < 4) {
            const moreProducts = await Product.find({
                _id: { $ne: product._id, $nin: relatedProducts.map(p => p._id) },
                // simple fallback: just other products for now to fill the row
            }).limit(4 - relatedProducts.length);
            relatedProducts = [...relatedProducts, ...moreProducts];
        }

        res.json(relatedProducts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getProducts,
    getNewArrivals,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRelatedProducts,
};
