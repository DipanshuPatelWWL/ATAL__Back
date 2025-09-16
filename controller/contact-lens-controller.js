const Contact_Lens = require("../model/contact-lens-model")
const Category = require("../model/category-model");
const SubCategory = require("../model/subcategory-model");


const addLens = async (req, res) => {
    try {
        let lensData = { ...req.body };

        // ✅ Validate required fields
        if (!lensData.lens_name || !lensData.brand_name || !lensData.lens_type) {
            return res.status(400).json({
                success: false,
                message: "Lens name, brand name, and lens type are required",
            });
        }

        // ✅ Find Category
        const category = await Category.findOne({
            categoryName: lensData.cat_sec,
        });

        if (!category) {
            return res.status(400).json({
                success: false,
                message: `Category '${lensData.cat_sec}' not found`,
            });
        }

        // Attach category reference
        lensData.cat_id = category._id;

        // ✅ Handle SubCategory
        if (lensData.subCategoryName) {
            let subCategory = await SubCategory.findOne({
                subCategoryName: lensData.subCategoryName.trim(),
                cat_id: category._id,
            });

            if (!subCategory) {
                subCategory = new SubCategory({
                    subCategoryName: lensData.subCategoryName.trim(),
                    cat_id: category._id,
                });
                await subCategory.save();
            }

            lensData.subCat_id = subCategory._id;
        }

        // ✅ Handle file uploads
        if (req.files && req.files.lens_image_collection) {
            lensData.lens_image_collection = req.files.lens_image_collection.map(
                (file) => file.filename
            );
        } else {
            lensData.lens_image_collection = [];
        }

        // ✅ Save lens
        const contactLens = new Contact_Lens(lensData);
        const savedLens = await contactLens.save();

        return res.status(201).json({
            success: true,
            message: "Lens added successfully",
            data: savedLens,
        });
    } catch (error) {
        console.error("Error while adding lens:", error);
        return res.status(500).json({
            success: false,
            message: "Error while adding lens",
            error: error.message,
        });
    }
};



const getLensById = async (req, res) => {
    try {
        const { id } = req.params;
        const Lens = await Contact_Lens.findById(id);
        if (!Lens) {
            return res.status(404).json({ message: "Lens not found" });
        }
        res.status(200).json({
            message: "Lens found successfully",
            success: true,
            Lens
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



//  Get All lens (search + filter)
const getAllLens = async (req, res) => {
    try {
        const { search, category, subCategory } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { lens_name: { $regex: search, $options: "i" } },
            ];
        }

        if (category) query.cat_sec = category;
        if (subCategory) query.subCategoryName = subCategory;

        const lenses = await Contact_Lens.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: lenses.length,
            lenses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching contact lens",
            error: error.message,
        });
    }
};


//  Update Lens
const updateLens = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        // Handle lens_image_collection (array)
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
        if (req.files && req.files.lens_image_collection) {
            const newUploads = req.files.lens_image_collection.map(
                (file) => file.filename
            );
            finalImages = [...finalImages, ...newUploads];
        }

        updateData.lens_image_collection = finalImages;

        const updatedLens = await Contact_Lens.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedLens) {
            return res.status(404).json({
                success: false,
                message: "Lens not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lens updated successfully",
            data: updatedLens,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating Lens",
            error: error.message,
        });
    }
};



//  Delete Lens
const deleteLens = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLens = await Contact_Lens.findByIdAndDelete(id);

        if (!deletedLens) {
            return res.status(404).json({
                success: false,
                message: "Lens not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lens deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting Lens",
            error: error.message,
        });
    }
};


module.exports = {
    addLens,
    getLensById,
    updateLens,
    deleteLens,
    getAllLens
}