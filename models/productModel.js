const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type : String,
        required: true,
    },
    price : {
        type :Number,
        required :true
    },
    stock :{
        type :Number,
        default:false
    },
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catagory",
    required: true
    },
    image:{
        type:[{type:String}]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isDeleted: {
    type: Boolean,
    default: false
}
},
{
    timestamps:true
})
const Product = mongoose.model ("Product",productSchema)
module.exports = Product