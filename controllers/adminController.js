const bcrypt = require("bcrypt")
const Admin = require(`../models/adminModel`)
const User = require(`../models/userModel`)
const Product = require("../models/productModel")
const Catagory = require("../models/catagoryModel")
const Order = require("../models/orderModel")
const adminService = require("../service/adminService")
const getLogin = (req, res) => {
    if (req.session.admin) {
        return res.redirect("/admin/dashboard")
    }
    res.render("admin/login", {error:null})
}

const postLogin = async (req, res) => {                                                            //loginpage
    try {
        const { email, password } = req.body
        const result = await adminService.loginAdmin(email, password)
        if (!result.success) {
            return res.render("admin/login", { error: result.message })
        }
        req.session.admin = result.admin._id
        res.redirect("/admin/dashboard")

    } catch (error) {
        console.log(error)
        res.render("admin/login", { error: "Something went wrong" })
    }
}

const getDashboard = async (req, res) => {                                                      //dashboard
    try {
        const data = await adminService.getDashboardData()
        res.render("admin/dashboard", data)
    } catch (error) {
        console.log(error)
    }
}

const getUsers = async (req, res) => {                                                          //usermanagement
    try {
        const users = await adminService.getAllUsers()
        res.render("admin/users", { users })
    } catch (error) {
        console.log(error)
    }
}

const blockUser =  async (req, res) => {
    try {
        const { id } = req.params
        const result = await adminService.BlockUser(id)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const getCategory = async (req, res) => {
    try {
        const categories = await adminService.getAllCategories()
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const count = await Product.countDocuments({ category: cat._id, isDeleted: false })
                return { ...cat._doc, productCount: count }
            })
        )
        res.render("admin/catagory", { categories: categoriesWithCount })
    } catch (error) {
        console.log(error)
    }
}

const addCategory = async (req, res) => {
    try {
        const data = req.body
        const result = await adminService.addCategory(data)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const toggleCategory = async (req, res) => {
    try {
        const { id } = req.params
        const result = await adminService.toggleCategory(id)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const result = await adminService.updateC
        ategory(id, data)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await adminService.getAllProducts()
        const categories = await adminService.getAllCategories()
        res.render("admin/product", { products, categories })
    } catch (error) {
        console.log(error)
    }
}

const addProduct = async (req, res) => {
    try {
        const data = req.body
        // console.log("files received",req.files)
        if (req.files && req.files.length > 0) {
            data.images = req.files.map(file => "/uploads/products/" + file.filename)
        }
        // console.log("images array",data.images)
        const result = await adminService.addProduct(data)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const toggleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const result = await adminService.toggleProduct(id)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        if (req.files && req.files.length > 0) {
            data.images = req.files.map(file => "/uploads/products/" + file.filename)
        }
        const result = await adminService.updateProduct(id, data)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const deleteProductImage = async (req, res) => {
    try {
        const { id } = req.params
        const { imagePath } = req.body
        const result = await adminService.deleteProductImage(id, imagePath)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const replaceProductImage = async (req, res) => {
    try {
        const { id } = req.params
        const index = parseInt(req.body.index)
        const newImage = "/uploads/products/" + req.files[0].filename
        const result = await adminService.replaceProductImage(id, index, newImage)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
            return res.redirect("/admin/dashboard")
        }
        res.redirect("/admin/login")
    })
}
//coupon
const getCoupon = async (req, res) => {
    try {
        const coupons = await adminService.getAllCoupons()
        res.render("admin/coupon", { coupons })
    } catch (error) {
        console.log(error)
    }
}

const addCoupon = async (req, res) => {
    try {
        const data = req.body
        const result = await adminService.addCoupon(data)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const result = await adminService.updateCoupon(id, data)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const toggleCoupon = async (req, res) => {
    try {
        const { id } = req.params
        const result = await adminService.toggleCoupon(id)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

const getOrders = async (req,res) =>{
    try {
        const orders = await Order.find().populate('userId','name email').sort({createdAt :-1})
        res.render('admin/orders',{orders})
    }catch(error){
        console.log(error)
        res.redirect('/admin/dashboard')
    }
}

const updateOrderStatus = async(req,res) =>{
    try{
        const orderId = req.params.id
        const {status} = req.body
        const order =  await Order.findById(orderId)
        if(order.orderStatus ==='cancelled' || order.orderStatus ==='returned'){
             return res.json({success:false,message:"Cannot update a cancelled or returned order!"})
             }
       const statusOrder =['placed','processing','shipped','delivered']
       const currentIndex = statusOrder.indexOf(order.orderStatus)
       const newIndex = statusOrder.indexOf(status)
       if(newIndex <= currentIndex){
        return res.json({success:false,message:"Connot go back to a previous status!"})
       }
       await Order.findByIdAndUpdate(orderId,{orderStatus:status})
        res.json({success:true})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Something went wrong"})
    }
}
const getAnalytics = async (req,res) => {
    try{
       const data = await adminService.getAnalyticsData()
       res.render('admin/analytics',data)
    }catch(error){
        console.log(error)
        res.redirect('/admin/dashboard')
    }
}
module.exports = {
    getLogin,
    postLogin,
    getDashboard,
    getUsers,
    blockUser,
    getCategory,
    addCategory,
    toggleCategory,
    updateCategory,
    getProducts,
    addProduct,
    toggleProduct,
    updateProduct,
    deleteProductImage ,
    replaceProductImage,
    logout,
    getCoupon,
    addCoupon ,
     updateCoupon ,
     toggleCoupon,
     getOrders,
     updateOrderStatus,
     getAnalytics
}
