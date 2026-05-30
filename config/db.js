const mongoose = require("mongoose")
const connectDB = async () => {
            try{
                await mongoose.connect("mongodb://localhost:27017/week7")
                console.log("Database connected")
            }
            catch(error){
                console.log("Database connected faild")
            }
}

module.exports = connectDB