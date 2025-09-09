const Product = require("../model/product-model");

const getProductByid = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).json({
            message: "product found successfully",
            success: true,
            product
        });
    }
    catch (err) {

    }
}

// GET products by category + subcategory
const getProdcutByCategoryname = async (req, res) => {
    try {
        let { cat_sec, subCategoryName } = req.params;
        cat_sec = decodeURIComponent(cat_sec);
        subCategoryName = decodeURIComponent(subCategoryName);
        const products = await Product.find({
            cat_sec: { $regex: `^${cat_sec}$`, $options: "i" },
            subCategoryName: { $regex: `^${subCategoryName}$`, $options: "i" }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add Product
const addProduct = async (req, res) => {
    try {
        let productData = { ...req.body };

        // Handle file uploads (multer fields)
        if (req.files) {
            if (req.files.product_image_collection) {
                productData.product_image_collection = req.files.product_image_collection.map(
                    (file) => file.filename
                );
            }
            if (req.files.product_lens_image1 && req.files.product_lens_image1[0]) {
                productData.product_lens_image1 = req.files.product_lens_image1[0].filename;
            }
            if (req.files.product_lens_image2 && req.files.product_lens_image2[0]) {
                productData.product_lens_image2 = req.files.product_lens_image2[0].filename;
            }
        }

        const product = new Product(productData);
        const savedProduct = await product.save();

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: savedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while adding product",
            error: error.message,
        });
    }
};

//  Get All Products (search + filter)
const getAllProducts = async (req, res) => {
    try {
        const { search, category, subCategory } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { product_name: { $regex: search, $options: "i" } },
                { product_description: { $regex: search, $options: "i" } },
                { product_frame_material: { $regex: search, $options: "i" } },
            ];
        }

        if (category) query.cat_sec = category;
        if (subCategory) query.subCategoryName = subCategory;

        const products = await Product.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching products",
            error: error.message,
        });
    }
};

//  Get Product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching product",
            error: error.message,
        });
    }
};


//  Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        // Handle product_image_collection (array)
        let finalImages = [];

        // Keep selected existing images
        if (req.body.existingImages) {
            // If frontend sends as JSON string
            if (typeof req.body.existingImages === "string") {
                finalImages = JSON.parse(req.body.existingImages);
            } else {
                finalImages = req.body.existingImages; // already array
            }
        }

        // Add newly uploaded images
        if (req.files && req.files.product_image_collection) {
            const newUploads = req.files.product_image_collection.map(
                (file) => file.filename
            );
            finalImages = [...finalImages, ...newUploads];
        }

        updateData.product_image_collection = finalImages;

        // Handle lens images
        if (req.files) {
            if (req.files.product_lens_image1 && req.files.product_lens_image1[0]) {
                updateData.product_lens_image1 = req.files.product_lens_image1[0].filename;
            }
            if (req.files.product_lens_image2 && req.files.product_lens_image2[0]) {
                updateData.product_lens_image2 = req.files.product_lens_image2[0].filename;
            }
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating product",
            error: error.message,
        });
    }
};


//  Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting product",
            error: error.message,
        });
    }
};



// Get products by categoryId + subCategoryId
const getProductsByCategoryAndSub = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.params;
        const products = await Product.find({ categoryId, subCategoryId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProdcutByCategoryname,
    getProductByid,
    getProductsByCategoryAndSub
};
