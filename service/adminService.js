const Admin = require("../models/adminModel")
const User = require("../models/userModel")
const Product = require("../models/productModel")
const Catagory = require("../models/catagoryModel")
const Coupon = require("../models/couponModel")
const Order = require("../models/orderModel")
const bcrypt = require("bcrypt")

const loginAdmin = async (email, password) => {                                                          //loginpage
    const admin = await Admin.findOne({ email })
    if (!admin) {
        return { success: false, message: "Email not found" }
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
        return { success: false, message: "Password do not match" }
    }
    return { success: true, admin }
}

const getDashboardData = async () => {                                                                 //dashboard page
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()

    return {totalUsers,totalProducts}
}

const getAllUsers = async () => {                                                                     //userManagement page
    return await User.find()
}

const BlockUser = async (id) => {
    const user = await User.findById(id)
    if (!user) {
        return { success: false, message: "User not found" }
    }
    user.isBlocked = !user.isBlocked
    await user.save()

    return {
        success: true,
        message: user.isBlocked ? "User blocked" : "User unblocked"
    }
}

const getAllCategories = async () => {                                                                        //catagory page
    return await Catagory.find()
}
const addCategory = async (data) => {
    const category = new Catagory(data)
    await category.save()
    return { success: true, message: "Category added successfully"}
}
const updateCategory = async (id, data) => {
    const category = await Catagory.findById(id)
    if (!category) return { success: false, message: "Category not found" }
    category.name = data.name
    category.description = data.description
    await category.save()
    return { success: true, message: "Category updated successfully" }
}

const toggleCategory = async (id) => {
    const category = await Catagory.findById(id)
    if (!category) return { success: false, message: "Category not found" }
    category.isActive = !category.isActive
    await category.save()
    await Product.updateMany(
        { category: id, isDeleted: false },
        { isActive: category.isActive }
    )
    return {
        success: true,
        message: category.isActive ? "Category enabled — all products enabled" : "Category disabled — all products disabled"
    }
}

const getAllProducts = async () => {
    return await Product.find({ isDeleted: false }).populate("category")
}

const addProduct = async (data) => {
    const product = new Product({
        name :data.name,
        category:data.category,
        price:data.price,
        stock:data.stock,
        description:data.description,
        image:data.images || []
    })
    await product.save()
    return { success: true, message: "Product added successfully" }
}  

const toggleProduct = async (id) => {
    const product = await Product.findById(id)
    if (!product) return { success: false, message: "Product not found" }
    product.isActive = !product.isActive
    await product.save()
    return {
        success: true,
        message: product.isActive ? "Product enabled" : "Product disabled"
    }
}

const updateProduct = async (id, data) => {
    const product = await Product.findById(id)
    if (!product) return { success: false, message: "Product not found" }
    product.name = data.name
    product.category = data.category
    product.price = data.price
    product.stock = data.stock
    product.description = data.description
    if (data.images && data.images.length > 0) {
        product.image = [...product.image, ...data.images]  
    }
    await product.save()
    return { success: true, message: "Product updated successfully" }
}
const deleteProductImage = async (id, imagePath) => {
    const product = await Product.findById(id)
    if (!product) return { success: false, message: "Product not found" }
    product.image = product.image.filter(img => img !== imagePath)
    await product.save()
    return { success: true, message: "Image deleted successfully" }
}
const replaceProductImage = async (id, index, newImage) => {
    const product = await Product.findById(id)
    if (!product) return { success: false, message: "Product not found" }
    product.image[index] = newImage
    await product.save()
    return { success: true, message: "Image replaced", imagePath: newImage }
}

//coupons
const getAllCoupons = async () => {
    return await Coupon.find({ isDeleted: false })  
}

const addCoupon = async (data) => {
    const existing = await Coupon.findOne({ code: data.code })
    
    if (existing && existing.isDeleted) {
        existing.isDeleted = false
        existing.discount = data.discount
        existing.minAmount = data.minAmount
        existing.expiryDate = data.expiryDate
        existing.isActive = true
        await existing.save()
        return { success: true, message: "Coupon added successfully" }
    }
    
    if (existing) {
        return { success: false, message: "Coupon code already exists" }
    }
    const coupon = new Coupon(data)
    await coupon.save()
    return { success: true, message: "Coupon added successfully" }
}

const updateCoupon = async (id, data) => {
    const coupon = await Coupon.findById(id)
    if (!coupon) return { success: false, message: "Coupon not found" }
    coupon.code = data.code
    coupon.discount = data.discount
    coupon.minAmount = data.minAmount
    coupon.expiryDate = data.expiryDate
    await coupon.save()
    return { success: true, message: "Coupon updated successfully" }
}

const toggleCoupon = async (id) => {
    const coupon = await Coupon.findById(id)
    if (!coupon) return { success: false, message: "Coupon not found" }
    coupon.isActive = !coupon.isActive
    await coupon.save()
    return { 
        success: true, 
        message: coupon.isActive ? "Coupon enabled" : "Coupon disabled" 
    }
}
  
const getAnalyticsData = async () =>{
     const todayStart = new Date()
        todayStart.setHours(0,0,0,0)
        const todayEnd = new Date()
        todayEnd.setHours(23,59,59,999)
        
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        weekStart.setHours(0,0,0,0)

        const monthStart = new Date()
        monthStart.setDate(1)
        monthStart.setHours(0,0,0,0)

        const todayOrders = await Order.find({createdAt:{$gte:todayStart,$lte :todayEnd}})
        const weekOrders = await Order.find({createdAt:{$gte:weekStart}})
        const monthOrders = await Order.find({createdAt:{$gte:monthStart}})
        const totalOrders = await Order.find()

        const todayRevenue = todayOrders.reduce((sum,o) =>sum + o.grandTotal,0)
        const weekRevenue = weekOrders.reduce((sum,o) =>sum + o.grandTotal,0)
        const monthRevenue = monthOrders.reduce((sum,o) => sum + o.grandTotal,0)
        const totalRevenue = totalOrders.reduce((sum,o) => sum + o.grandTotal,0)

        const topProducts = await Order.aggregate([
            {$unwind :"$items"},
            {$group :{_id :"$items.name",totalSold:{ $sum :"$items.quantity"}}},
            {$sort:{totalSold:-1}},
            {$limit :5}
        ])

        const monthSales = await Order.aggregate([
            {$group:{
                _id :{month : {$month:"$createdAt"},year:{$year :"$createdAt"}},
                revenue:{$sum :"$grandTotal"},
                orders :{$sum:1}
            }},
            {$sort :{"_id.year":1, "_id.month":1}},
        ])
       const dailySales = await Order.aggregate([
    { $match: {createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },} },
    {$group: {_id: {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" }
            },
            revenue: { $sum: "$grandTotal" },
            orders: { $sum: 1 }
        } }, { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ])
        const weeklySales = await Order.aggregate([
            {$match:{createdAt:{$gte :new Date(Date.now() - 56*24*60*60*1000)},
            orderStatus:{$nin:['cancelled','returned']}}},
            {$group:{_id:{week:{$week:"$createdAt"},year:{$year:"$createdAt"}},
        orders:{$sum:1}}},
        {$sort:{"_id.year":1,"_id.week":1}}
        ])
        const statusData = await Order.aggregate([
            {$group:{_id:"$orderStatus",count:{$sum:1}}}
        ])
        return{
            todayOrders:todayOrders.length,todayRevenue,
            weekOrders:weekOrders.length,weekRevenue,
            monthOrders:monthOrders.length,monthRevenue,
            totalOrders:totalOrders.length,totalRevenue,
            topProducts,
            monthlySales:monthSales,
            dailySales,
            weeklySales,
            statusData
        }
}   
module.exports ={ loginAdmin ,
                  getDashboardData,
                  getAllUsers ,
                  BlockUser,
                  getAllCategories,
                  addCategory ,
                  updateCategory,
                  toggleCategory,
                  getAllProducts ,
                  addProduct ,
                  toggleProduct,
                  updateProduct,
                  deleteProductImage,
                  replaceProductImage,
                  getAllCoupons,
                  addCoupon,
                  updateCoupon,
                  toggleCoupon,
                  getAnalyticsData 
                }
