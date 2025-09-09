const bcrypt = require("bcryptjs");
const Customer = require("../model/customer-model"); // adjust path if needed

const registerCustomer = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            mobilePhone,
            smsOptIn,
            email,
            password,
            twoFactorAuth,
            address,
            communicationPreference,
            marketingOptIn,
        } = req.body;

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newCustomer = new Customer({
            firstName,
            lastName,
            dateOfBirth,
            mobilePhone,
            smsOptIn,
            email,
            password: hashedPassword,
            twoFactorAuth,
            address,
            communicationPreference,
            marketingOptIn,
            prescriptionFile: req.file ? req.file.path : null,
        });

        await newCustomer.save();

        res.status(201).json({
            message: "Customer registered successfully",
            customer: {
                id: newCustomer._id,
                firstName: newCustomer.firstName,
                lastName: newCustomer.lastName,
                email: newCustomer.email,
                mobilePhone: newCustomer.mobilePhone,
            },
        });
    } catch (error) {
        console.error("Error in registerCustomer:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get Customer by ID
const fetchCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customer",
            error: error.message,
        });
    }
};


module.exports = { registerCustomer, fetchCustomerById };
