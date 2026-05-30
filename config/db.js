require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = async () => {
            try{
                await mongoose.connect("MONGODB_URI")
                console.log("Database connected")
            }
            catch(error){
                console.log("Database connected faild")
            }
}
module.exports = connectDB