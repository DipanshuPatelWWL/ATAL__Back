const mongoose = require("mongoose")
const LensSchema = new mongoose.Schema({
    lens_name: { type: String },
    brand_name: { type: String },
    total_price: { type: Number },
    sale_price: { type: Number },
    lens_type: { type: String },
    material: { type: String },
    description: { type: String },
    manufacturer: { type: String },
    water_content: { type: String },
    lens_image_collection: {
        type: [String],
        default: [],
    },


    cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
})

module.exports = mongoose.model("ContactLens", LensSchema)