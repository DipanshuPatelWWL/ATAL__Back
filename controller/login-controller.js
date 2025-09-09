const Customer = require("../model/customer-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create JWT
        const token = jwt.sign(
            { id: customer._id, email: customer.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Send response
        res.json({
            message: "Login successful",
            token,
            customer: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                mobilePhone: customer.mobilePhone,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { loginCustomer };
