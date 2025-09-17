const Product = require("../model/product-model");
const Category = require("../model/category-model");
const SubCategory = require("../model/subcategory-model");
const mongoose = require("mongoose");

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product", error: error.message });
  }
};

// Get products by category + subcategory name
const getProdcutByCategoryname = async (req, res) => {
  try {
    let { cat_sec, subCategoryName } = req.params;
    cat_sec = decodeURIComponent(cat_sec);
    subCategoryName = decodeURIComponent(subCategoryName);

    const products = await Product.find({
      cat_sec: { $regex: `^${cat_sec}$`, $options: "i" },
      subCategoryName: { $regex: `^${subCategoryName}$`, $options: "i" },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add product
const addProduct = async (req, res) => {
  try {
    let productData = { ...req.body };

    // 🔎 Find Category
    const category = await Category.findOne({ categoryName: productData.cat_sec });
    if (!category) {
      return res.status(400).json({ success: false, message: `Category '${productData.cat_sec}' not found` });
    }
    productData.cat_id = category._id;

    // 🔎 Handle SubCategory
    if (productData.subCategoryName) {
      let subCategory = await SubCategory.findOne({
        subCategoryName: productData.subCategoryName.trim(),
        cat_id: category._id,
      });
      if (!subCategory) {
        subCategory = new SubCategory({
          subCategoryName: productData.subCategoryName.trim(),
          cat_id: category._id,
        });
        await subCategory.save();
      }
      productData.subCat_id = subCategory._id;
    }

    // Handle file uploads (multer fields)
    if (req.files) {
      if (req.files.product_image_collection) {
        productData.product_image_collection = req.files.product_image_collection.map((file) => file.filename);
      }
      if (req.files.product_lens_image1?.[0]) {
        productData.product_lens_image1 = req.files.product_lens_image1[0].filename;
      }
      if (req.files.product_lens_image2?.[0]) {
        productData.product_lens_image2 = req.files.product_lens_image2[0].filename;
      }
    }

    const product = new Product(productData);
    const savedProduct = await product.save();

    return res.status(201).json({ success: true, message: "Product added successfully", data: savedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while adding product", error: error.message });
  }
};

// Get all products (search + filter)
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

    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while fetching products", error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Handle images
    let finalImages = [];
    if (req.body.existingImages) {
      finalImages = typeof req.body.existingImages === "string"
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages;
    }
    if (req.files?.product_image_collection) {
      finalImages = [...finalImages, ...req.files.product_image_collection.map((f) => f.filename)];
    }
    updateData.product_image_collection = finalImages;

    if (req.files?.product_lens_image1?.[0]) {
      updateData.product_lens_image1 = req.files.product_lens_image1[0].filename;
    }
    if (req.files?.product_lens_image2?.[0]) {
      updateData.product_lens_image2 = req.files.product_lens_image2[0].filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while updating product", error: error.message });
  }
};

//  Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while deleting product", error: error.message });
  }
};

// Get products by categoryId + subCategoryId
// const getProductsByCategoryAndSub = async (req, res) => {
//   try {
//     const { categoryId, subCategoryId } = req.params;
//     const products = await Product.find({ cat_id: categoryId, subCat_id: subCategoryId });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };





// GET /api/products/:categoryId/:subCategoryId
const getProductsByCategoryAndSub = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;

    // Ensure valid ObjectIds
    if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(subCategoryId)) {
      return res.status(400).json({ error: "Invalid categoryId or subCategoryId" });
    }

    const products = await Product.find({
      cat_id: new mongoose.mongo.ObjectId(categoryId),
      subCat_id: new mongoose.mongo.ObjectId(subCategoryId),
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Search products
const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) query.product_name = { $regex: search, $options: "i" };

    const products = await Product.find(query).limit(20);
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while searching products", error: error.message });
  }
};

// Get products by SubCategory ID
const getProductBySubCatId = async (req, res) => {
  try {
    const { subCatId } = req.params;
    if (!subCatId) return res.status(400).json({ success: false, message: "SubCategory ID is required" });

    const products = await Product.find({ subCat_id: subCatId })
      .populate("cat_id", "categoryName")
      .populate("subCat_id", "subCategoryName");

    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found for this SubCategory" });
    }

    return res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error while fetching products", error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProdcutByCategoryname,
  getProductsByCategoryAndSub,
  getProductBySubCatId,
  searchProducts,
};
