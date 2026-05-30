const mongoose = require("mongoose")
const catagorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    isActive :{
        type:Boolean,
        default:true
    },
    description:{
        type:String,
        required:true
    }
},
{timestamps:true})

 const Catagory = mongoose.model("Catagory",catagorySchema)
module.exports = Catagory