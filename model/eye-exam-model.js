const mongoose = require("mongoose")
const EyeExamSchema = new mongoose.Schema({
    appointment_date: { type: String, required: true },
    exam_name: { type: String, required: true },
    doctor_name: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    gender: { type: String, required: true },
    dateOfBirth: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
})

module.exports = mongoose.model("EyeExamSchema", EyeExamSchema)