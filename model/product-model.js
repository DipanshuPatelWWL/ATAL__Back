const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        product_name: { type: String },
        product_sku: { type: String },
        product_price: { type: Number },
        product_sale_price: { type: Number },
        product_description: { type: String },
        product_status: {
            type: Boolean,
            default: false
        },

        // Multiple product images
        product_image_collection: [String],

        // Frame details
        product_frame_material: { type: String },
        product_frame_shape: { type: String },
        product_frame_color: { type: String },
        product_frame_fit: { type: String },

        gender: { type: String },

        // Category support
        cat_sec: { type: String }, // e.g. "Sunglasses"
        subCategoryName: { type: String }, // e.g. "Round Frame"

        // Lens details
        product_lens_title1: { type: String },
        product_lens_description1: { type: String },
        product_lens_image1: { type: String },

        product_lens_title2: { type: String },
        product_lens_description2: { type: String },
        product_lens_image2: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
