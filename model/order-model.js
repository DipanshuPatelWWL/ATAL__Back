// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

//     cartItems: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//             name: String,
//             image: String,
//             price: Number,
//             quantity: Number,
//         },
//     ],

//     shippingAddress: {
//         fullName: String,
//         address: String,
//         city: String,
//         province: String,
//         postalCode: String,
//         country: String,
//         phone: String,
//     },

//     billingAddress: {
//         fullName: String,
//         address: String,
//         city: String,
//         province: String,
//         postalCode: String,
//         country: String,
//         phone: String,
//     },

//     subtotal: Number,
//     tax: Number,
//     shipping: Number,
//     total: Number,

//     paymentMethod: { type: String, default: "COD" },
//     paymentStatus: { type: String, default: "Pending" },
//     transactionId: String,

//     orderStatus: {
//         type: String,
//         enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
//         default: "Placed",
//     },

//     insurance: {
//     policyId: { type: mongoose.Schema.Types.ObjectId, ref: "Policy" },
//     purchasedAt: Date,
//     validTill: Date,
//     pricePaid: Number, // the insurance fee customer paid
//     status: { type: String, enum: ["Active", "Expired"], default: "Active" },
// },


//     trackingNumber: String,
//     deliveryDate: Date,

//     trackingHistory: [
//         {
//             status: {
//                 type: String,
//                 enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
//             },
//             message: String,
//             updatedAt: { type: Date, default: Date.now },
//         },
//     ],
// }, { timestamps: true });

// module.exports = mongoose.model("Order", orderSchema);














// backend/model/order-model.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            image: String,
            price: Number,
            quantity: Number,
        },
    ],

    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        phone: String,
    },

    billingAddress: {
        fullName: String,
        address: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        phone: String,
    },

    subtotal: Number,
    tax: Number,
    shipping: Number,
    total: Number,

    paymentMethod: { type: String, default: "COD" },
    paymentStatus: { type: String, default: "Pending" },
    transactionId: String,

    orderStatus: {
        type: String,
        enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Failed"],
        default: "Placed",
    },

    insurance: {
        policyId: { type: mongoose.Schema.Types.ObjectId, ref: "InsurancePolicy" }, // <- changed ref
        purchasedAt: Date,
        validTill: Date,
        pricePaid: Number, // the insurance fee customer paid
        status: { type: String, enum: ["Active", "Expired"], default: "Active" },
    },

    trackingNumber: String,
    deliveryDate: Date,

    trackingHistory: [
        {
            status: {
                type: String,
                enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
            },
            message: String,
            updatedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
