/**
 * Cloudinary Image Optimization Utilities
 * Generates optimized CDN URLs with Cloudinary transformations
 */

const CLOUDINARY_CLOUD_NAME = 'dtu7thsx0';

/**
 * Build an optimized Cloudinary URL with transformations for CDN delivery
 * @param {string} url - Original Cloudinary URL or any image URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
    if (!url) return '';

    // If it's not a Cloudinary URL, return as-is
    if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
        return url;
    }

    const {
        width,
        height,
        quality = 'auto',
        format = 'auto',
        crop = 'fill',
        gravity = 'auto',
    } = options;

    // Build transformation string
    const transforms = [];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push(`c_${crop}`);
    if (gravity && crop !== 'limit') transforms.push(`g_${gravity}`);
    transforms.push(`q_${quality}`);
    transforms.push(`f_${format}`);

    const transformStr = transforms.join(',');

    // Parse the Cloudinary URL and inject transformations
    // Pattern: https://res.cloudinary.com/{cloud}/image/upload/{existing_transforms}/{path}
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const baseUrl = url.substring(0, uploadIndex + 8); // includes '/upload/'
    const restUrl = url.substring(uploadIndex + 8);

    // Remove any existing transformations (they start with letters and contain underscores)
    // Keep only the version (v123456) and path parts
    const parts = restUrl.split('/');
    const cleanParts = [];
    let foundVersion = false;
    for (const part of parts) {
        if (part.match(/^v\d+$/)) {
            foundVersion = true;
            cleanParts.push(part);
        } else if (foundVersion || part.includes('.')) {
            cleanParts.push(part);
        } else if (!part.match(/^[a-z]_/i) && !part.match(/^[a-z]{1,3}_/)) {
            // This is likely a folder path like 'markrin/products'
            cleanParts.push(part);
        }
    }

    return `${baseUrl}${transformStr}/${cleanParts.join('/')}`;
}

// Preset sizes for common use cases
export const IMAGE_SIZES = {
    thumbnail: { width: 150, height: 150, crop: 'fill' },
    card: { width: 400, height: 500, crop: 'fill' },
    productGrid: { width: 600, height: 750, crop: 'fill' },
    productDetail: { width: 800, height: 1000, crop: 'limit' },
    productFullRes: { width: 1200, height: 1500, crop: 'limit' },
    hero: { width: 1920, height: 1080, crop: 'fill' },
};

/**
 * Quick helper — get a thumbnail URL
 */
export function getThumbnailUrl(url) {
    return getOptimizedImageUrl(url, IMAGE_SIZES.thumbnail);
}

/**
 * Quick helper — get a card-sized URL for product grids
 */
export function getCardUrl(url) {
    return getOptimizedImageUrl(url, IMAGE_SIZES.card);
}

/**
 * Quick helper — get a product detail page URL
 */
export function getProductDetailUrl(url) {
    return getOptimizedImageUrl(url, IMAGE_SIZES.productDetail);
}

/**
 * Quick helper — get the full resolution URL (for zoom)
 */
export function getFullResUrl(url) {
    return getOptimizedImageUrl(url, IMAGE_SIZES.productFullRes);
}
