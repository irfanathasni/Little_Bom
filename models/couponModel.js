const mongoose = require("mongoose")
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    minAmount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {         
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Coupon = mongoose.model("Coupon", couponSchema)
module.exports = Coupon