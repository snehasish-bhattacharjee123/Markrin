const Product = require('../models/Product');
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
        // Category filter (can be comma-separated)
        if (category) {
            let categoryIds = [];
            const categoriesToCheck = category.split(',');

            // Check if input is ObjectId or Name/Slug
            const categoryDocs = await Category.find({
                $or: [
                    { _id: { $in: categoriesToCheck.filter(c => mongoose.Types.ObjectId.isValid(c)) } },
                    { slug: { $in: categoriesToCheck } },
                    { name: { $in: categoriesToCheck } }
                ]
            });

            categoryIds = categoryDocs.map(c => c._id);

            if (categoryIds.length > 0) {
                query.category = { $in: categoryIds };
            } else {
                // If categories provided but none found, return empty
                if (categoriesToCheck.length > 0) return res.json({ products: [], page: 1, pages: 0, total: 0 });
            }
        }

        // Gender filter
        if (gender) {
            query.gender = gender;
        }

        // Color filter (can be comma-separated)
        if (color) {
            query.colors = { $in: color.split(',') };
        }

        // Size filter (can be comma-separated)
        if (size) {
            query.sizes = { $in: size.split(',') };
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
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
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
                    sortObj = { price: 1 };
                    break;
                case 'price_desc':
                    sortObj = { price: -1 };
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
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        let product;

        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id).populate('category');
        } else if (id.includes('-') || id.length > 20) {
            product = await Product.findOne({ slug: id.toLowerCase() }).populate('category');
        } else {
            product = await Product.findOne({
                name: { $regex: id, $options: 'i' }
            }).populate('category');
        }

        if (product) {
            res.json(product);
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
            sizeChart,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock: countInStock || 0,
            category,
            brand,
            sizes: sizes || [],
            colors: colors || [],
            collections,
            material,
            gender,
            images: images || [],
            isFeatured: isFeatured || false,
            isNewArrival: isNewArrival || false,
            tags: tags || [],
            sku,
            user: req.user._id,
            dimensions,
            weight,
            metaTitle,
            metaDescription,
            metaKeywords,
            bestFit,
            sizeChart,
        });

        const createdProduct = await product.save();

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
            Object.assign(product, req.body);
            const updatedProduct = await product.save();

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
            }).limit(4).populate('category');
        }

        // 2. If not enough, try tags or collections (placeholder logic for now)
        if (relatedProducts.length < 4) {
            const moreProducts = await Product.find({
                _id: { $ne: product._id, $nin: relatedProducts.map(p => p._id) },
                // simple fallback: just other products for now to fill the row
            }).limit(4 - relatedProducts.length).populate('category');
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
