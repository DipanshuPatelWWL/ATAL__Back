const Product = require("../model/product-model");
const Category = require("../model/category-model");
const SubCategory = require("../model/subcategory-model");
const mongoose = require("mongoose");

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // const product = await Product.findById({ id: id, productStatus: "Approved" });
    const product = await Product.findOne({
      _id: id,
      $or: [
        { productStatus: "Approved" },
        { productStatus: { $exists: false } } // handles case when productStatus key doesn't exist
      ]
    });
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
      // productStatus: "Approved"
      $or: [
        { productStatus: "Approved" },
        { productStatus: { $exists: false } }
      ]
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const addProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Find Category
    const category = await Category.findOne({ categoryName: productData.cat_sec });
    if (!category) {
      return res.status(400).json({ success: false, message: `Category '${productData.cat_sec}' not found` });
    }
    productData.cat_id = category._id;

    // Handle SubCategory
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

    // Handle file uploads
    if (req.files) {
      if (req.files.product_image_collection) {
        productData.product_image_collection = req.files.product_image_collection.map(f => f.filename);
      }
      if (req.files.product_lens_image1?.[0]) {
        productData.product_lens_image1 = req.files.product_lens_image1[0].filename;
      }
      if (req.files.product_lens_image2?.[0]) {
        productData.product_lens_image2 = req.files.product_lens_image2[0].filename;
      }
    }

    // Role-based handling
    const now = new Date();

    if (req.user.role === "admin") {
      productData.productStatus = "Approved";
      productData.isSentForApproval = true;
      productData.approvedBy = req.user.name;
      productData.approvedDate = now;
      productData.createdBy = req.user.role;
      productData.createdDate = now;
    } else if (req.user.role === "vendor") {
      productData.vendorID = req.user.id;
      productData.productStatus = "Pending";
      productData.isSentForApproval = false;
      productData.createdBy = req.user.role;
      productData.createdDate = now;
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized role to add product" });
    }

    // Save product
    const product = new Product(productData);
    const savedProduct = await product.save();

    return res.status(201).json({ success: true, message: "Product added successfully", data: savedProduct });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while adding product", error: error.message });
  }
};





const getAllProducts = async (req, res) => {
  try {
    const { search, category, subCategory } = req.query;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { product_name: { $regex: search, $options: "i" } },
        { product_description: { $regex: search, $options: "i" } },
        { product_frame_material: { $regex: search, $options: "i" } },
      ];
    }

    // Category filters
    if (category) query.cat_sec = category;
    if (subCategory) query.subCategoryName = subCategory;

    // Status filter (merge with query)
    query.$or = query.$or
      ? [...query.$or, { productStatus: "Approved" }, { productStatus: { $exists: false } }]
      : [{ productStatus: "Approved" }, { productStatus: { $exists: false } }];

    // Final query
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


const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      productStatus: { $in: ["Pending", "Rejected"] }
    }).sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      products
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


// Controller to fetch all products based on filter
const getVendorApprovalProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isSentForApproval: true,
      productStatus: "Pending"
    });

    return res.status(200).json({
      success: true,
      products
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


// Controller to send product for approval
const sendProductForApproval = async (req, res) => {
  const { productId } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isSentForApproval: true },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product sent for approval",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to send product for approval",
    });
  }
};



const sendApprovedProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { productStatus: "Approved" }, //  use the correct field name
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product approved successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: err.message,
    });
  }
};



const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, {
      productStatus: "Rejected",
      rejectionReason: req.body.message
    },
      { new: true });
    if (!product) { return res.status(404).json({ success: false, message: "Product not found" }); }
    res.json({ success: true, message: "Product rejected", product });
  }
  catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
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


// Update vendor product on condition
const updateVendorProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Fetch existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) return res.status(404).json({ success: false, message: "Product not found" });

    // If product is sent for approval, allow only price and sale_price updates
    if (existingProduct.isSentForApproval) {
      const allowedFields = ["price", "sale_price"];
      updateData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});
    } else {
      // Handle images only if product is NOT sent for approval
      let finalImages = [];
      if (req.body.existingImages) {
        finalImages = typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
      }
      if (req.files?.product_image_collection) {
        finalImages = [...finalImages, ...req.files.product_image_collection.map(f => f.filename)];
      }
      updateData.product_image_collection = finalImages;

      if (req.files?.product_lens_image1?.[0]) {
        updateData.product_lens_image1 = req.files.product_lens_image1[0].filename;
      }
      if (req.files?.product_lens_image2?.[0]) {
        updateData.product_lens_image2 = req.files.product_lens_image2[0].filename;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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



const getProductsByCategoryAndSub = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "Invalid subCategoryId" });
    }

    // Query products by ObjectId
    const products = await Product.find({
      cat_id: new mongoose.Types.ObjectId(categoryId),
      subCat_id: new mongoose.Types.ObjectId(subCategoryId),
      // productStatus: "Approved"
      $or: [
        { productStatus: "Approved" },
        { productStatus: { $exists: false } }
      ]
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
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

    const products = await Product.find({
      subCat_id: subCatId, $or: [
        { productStatus: "Approved" },
        { productStatus: { $exists: false } }
      ]
    })
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
  getVendorProducts,
  getVendorApprovalProducts,
  sendProductForApproval,
  sendApprovedProduct,
  rejectProduct,
  updateVendorProduct
};
