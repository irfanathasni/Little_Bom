const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Admin = require ("../models/adminModels")
mongoose.connect("mongodb://localhost:27017/week7")

async function addAdmin(){
const email = "admin@gmail.com"
const password = "123"
const hashedpassword = await bcrypt.hash(password,10)
 await Admin.create({
    email:email,
    password:hashedpassword
})
console.log("Admin added")
process.exit(0)
}

addAdmin()