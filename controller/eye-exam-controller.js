const EyeExam = require("../model/eye-exam-model")


const addEyeExam = async (req, res) => {
    try {
        const { appointment_date,
            exam_name,
            doctor_name,
            first_name,
            last_name,
            gender,
            dateOfBirth,
            phone,
            email,
        } = req.body

        const newBookExam = new EyeExam({
            appointment_date,
            exam_name,
            doctor_name,
            first_name,
            last_name,
            gender,
            dateOfBirth,
            phone,
            email
        })

        await newBookExam.save()
        res.status(200).json({
            success: true,
            message: "Eye Exam booked successfully",
            data: newBookExam
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eye Exam not conducted" })
    }
}



//get API
const getEyeExam = async (req, res) => {
    try {
        const eyeExam = await EyeExam.find()
        return res.status(200).json({
            success: true,
            message: "EyeExam Fetched",
            eyeExam
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}



module.exports = {
    addEyeExam,
    getEyeExam
}