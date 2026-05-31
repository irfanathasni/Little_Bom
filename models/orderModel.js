const mongoose = require("mongoose")
const orderItemSchema = new mongoose.Schema({
    productId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    image:{
        type:String
    }
})
const orderSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items :[orderItemSchema],

    address :{
        name : {
            type:String,
            required:true
        },
        mobile:{
            type:String,
            required:true
        },
        house:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        }
    },
    subtotal:{
        type:Number,
        required:true
    },
    shipping:{
        type:Number,
        default:80
    },
    discount:{
        type:Number,
        default:0
    },
    grandTotal:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["razorpay","cod"],default:"razorpay"
    },
    paymentStatus:{
        type:String,
       enum:["pending","completed","failed"],
        default:"pending"
    },
    razorpayOrderId :{
        type:String
    },
    razorpayPaymentId :{
        type:String
    },
    razorpaySignature :{
        type:String
    },
    orderStatus :{
        type:String,
        enum:["placed","processing","shipped","out_for_delivery","deliverd","cancelled","returned"],
        default:"placed"
    },
    cancelReason :{
        type:String
    },
    returnReason:{
        type:String
    }
},{timestamps:true})

 const Order = mongoose.model("Order",orderSchema)
 module.exports = Order