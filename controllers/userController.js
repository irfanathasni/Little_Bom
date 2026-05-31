const userService = require("../service/userService")
const Product = require("../models/productModel") 
const Catagory= require("../models/catagoryModel")
const Cart = require("../models/cartModel")
const User = require("../models/userModel")
const Address = require("../models/addressModel")
const Razorpay = require("razorpay")
const crypto = require("crypto")
const Order = require("../models/orderModel")
const Coupon = require("../models/couponModel")

const getRegister = (req, res) => {
    res.render("user/register",{error:null})
}
const postRegister = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        if (password !== confirmPassword) {
            return res.render("user/register", {
                error: "Passwords do not match"
            })
        }
        await userService.registerUser({ name, email, password })
        res.redirect("/login");
    } catch (err) {
        res.render("user/register", { error: err.message })
    }
}

const getLogin = (req, res) => {
    res.render("user/login",{error:null})
}

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userService.loginUser(email, password)
        req.session.user = user
        res.redirect("/home")
    } catch (err) {
        res.render("user/login", { error: err.message })
    }
}

const logout = (req, res) => {
    req.session.destroy()
    res.redirect("/login")
}

const getShop= (req,res) => {
    res.render(`user/shop`)
}

const getProducts = async (req,res) => {
    try{
        // console.log(req.query)
       const {search,category,sort,page} = req.query
       const data = await userService.fetchProducts(search,category,sort,page)
        if(req.headers.accept.includes("application/json")){
            return res.json({success:true,...data})
        }
        res.json({status:true,...data})
    }
    catch(e){
        console.log(e)
        res.json({success:false})
    }
}
const getHome = (req,res) =>{
    res.render(`user/home`)
}
const getHomeProducts = async (req,res) =>{
    try{
        const product = await Product.findOne()
        const categories = await Catagory.find({isActive:true})
        res.json({success:true,heroImage:product.image[0],categories})
    }
    catch(error){
        console.log(error)
        res.json({success:false})
    }
}
//productDetails
const productDetails = async(req,res) =>{
    try{
        //  console.log("Route working")
        const productId = req.params.id
        // console.log(productId)
        const product = await userService.getproductDetails(productId)
        // console.log(product)
        if(!product){
            return res.send("product not found")
        }
        res.render(`user/productDetail`,{product})
        // res.send(product)
    }
    catch(error){
        console.log(error)
    }
}
const getProfile = async (req, res) => {
   try {
     const user = await User.findById(req.session.user._id)
     const addresses = await Address.find({userId: req.session.user._id})
     const orders = await Order.find({userId: req.session.user._id}).sort({createdAt: -1})
     
     const totalOrders = orders.length
     const delivered = orders.filter(o => o.orderStatus === 'delivered').length
     const inProgress = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length
     
     res.render(`user/profile`, {user, addresses, orders, totalOrders, delivered, inProgress})
   }
   catch(error) {
     console.log(error)
   }
}
const updateProfile = async (req,res) =>{
  try{
    const userId = req.session.user._id
    const {name,email} = req.body
    // console.log(req.body)
    await userService.updateProfile(userId,name,email)

res.json({success:true})
}catch(error){
    console.log(error)
}}
const addAddress = async (req,res) =>{
    try{
        const userId = req.session.user._id
        await userService.addAddress(userId,req.body)
        // console.log(req.body)
        res.json({success:true})
    }
    catch(error){
        console.log(error)
        res.json({success:false})
    }
}
const deleteAddress = async (req,res)=>{
    try{
        const addressId = req.params.id
        // console.log(addressId)
        await userService.deleteAddress(addressId)
        res.json({success:true})
    }
    catch(err){
    console.log(err)
    res.json({success:false})
    }
}
const editAddress = async(req,res) =>{
    try{
        const addressId = req.params.id
        await userService.editAddress(addressId,req.body)
        res.json({success:true})
    }catch (error){
        console.log(error)
        res.json({success:false})
    }
}
const addToCart = async(req,res) =>{
    try{
        const userId = req.session.user._id
        const{productId} = req.body
        await userService.addToCart(userId,productId)
        res.json({success:true})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getCart = async (req,res) =>{
    // console.log("session user:", req.session.user)
    const userId = req.session.user._id
    const {cartItems,subtotal,shipping,grandTotal} = await userService.getCartItems(userId)
    res.render(`user/cart`,{
        cartItems,
       subtotal: subtotal || 0,
        shipping: shipping || 0,
        grandTotal: grandTotal || 0
    })
}
const removeFromCart = async(req,res) =>{
    const userId = req.session.user._id
    const {productId} = req.params
    await userService.removeCartItem(userId,productId)
    res.json({success:true})
}
const updateCartQuantity = async (req,res) =>{
    try{
        const userId = req.session.user._id
        const {productId,quantity} = req.body
        await userService.updateCartQuantity(userId,productId,quantity)
        res.json({success:true})
    }
    catch(error){
        console.log(error)
        res.json({success:false})
    }
}
const getCartSummary = async(req,res) =>{
    try{
        const userId = req.session.user._id
        const {subtotal,shipping,grandTotal} = await userService.getCartItems(userId)
        res.json({success:true,subtotal,shipping,grandTotal})
    }catch(error){
        console.log(error)
        res.json({success:true})
    }
}
const applyCoupon = async (req,res) =>{
    try{
        const {code} = req.body 
        const userId = req.session.user._id
        const result = await userService.applyCoupon(userId,code)
        if  (result.success){
            req.session.appliedCoupon = {code:code}
        }
        res.json(result)
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Something went wrong"})
    }
}
const changePassword = async (req, res) => {
    try {
        const userId = req.session.user._id
        const { currentPassword, newPassword } = req.body
        const result = await userService.updatePassword(
            userId,
            currentPassword,
            newPassword
        )
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Something went wrong"
        })}
}
const getCheckout = async(req,res) =>{
    try{
        const userId = req.session.user._id
        const user = await User.findById(userId)
        const addresses = await Address.find({userId})
        const {cartItems,subtotal,shipping,grandTotal} = await userService.getCartSummary(userId)
        if(cartItems.length ===0)
        return res.redirect("/cart")
        let discountAmount = 0
        let finalTotal = grandTotal
        const appliedCoupon = req.session.appliedCoupon
        if(appliedCoupon){
            const coupon = await Coupon.findOne({code:appliedCoupon.code,isActive:true})
            if(coupon && coupon.expiryDate > new Date() &&grandTotal >= coupon.minAmount){
                discountAmount = coupon.discount
                finalTotal = grandTotal - discountAmount
            }else {
                req.session.appliedCoupon = null
            }
        }
                res.render("user/checkout",{
            user,addresses,cartItems,subtotal,shipping,grandTotal,
            discountAmount,finalTotal,
            appliedCoupon:req.session.appliedCoupon,
            razorpayKeyId:process.env.RAZORPAY_KEY_ID
        })
    }catch(error){
        console.log(error)
        res.redirect("/cart")
    }
}
const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})
const createRazorPayOrder = async (req,res) =>{
    try{
        const userId = req.session.user._id
        const {cartItems,grandTotal} = await userService.getCartSummary(userId)
        if(cartItems.length ===0){
            return res.json({success:false,message:"Cart is empty"})
        }
        let finalTotal = grandTotal
        const appliedCoupon = req.session.appliedCoupon
        if(appliedCoupon){
            const coupon = await Coupon.findOne({code:appliedCoupon.code,isActive:true})
            if(coupon && coupon.expiryDate >new Date() && grandTotal >=coupon.minAmount){
                finalTotal = grandTotal - coupon.discount
            }
        }
        const options ={
            amount:finalTotal *100,
            currency :"INR",
            receipt:`receipt_${Date.now()}`
        }
        const order =await razorpay.orders.create(options)
        res.json({success:true,order})
    }catch(error){
        console.log(error)
        res.json({sucess:false,message:"Failed to create order"})
    }
}
const verifyPayment = async (req, res) => {
    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature,addressId} = req.body
        // console.log("addressId received:",addressId)
        const userId = req.session.user._id
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex")
    if(expectedSignature !== razorpay_signature){
        return res.json({success:false,message:"Payment verification failed"})
    }
    const address = await Address.findById(addressId) 
    const {cartItems,subtotal,shipping,grandTotal} = await userService.getCartSummary(userId)
    let discountAmount = 0
    let finalTotal = grandTotal
    const appliedCoupon = req.session.appliedCoupon
    if(appliedCoupon){
        const coupon = await Coupon.findOne({code:appliedCoupon.code,isActive:true})
        if(coupon && coupon.expiryDate > new Date() &&grandTotal >= coupon.minAmount){
            discountAmount = coupon.discount
            finalTotal = grandTotal - discountAmount
        }
    }
     const order = await Order.create({
        userId,
        items:cartItems.map(item =>({
            productId :item.product._id,
            name:item.product.name,
            price:item.product.price,
            quantity:item.quantity,
            image:item.product.image[0]
        })),
        address:{
            name:address.name,
            mobile: String(address.mobile),
            house:address.house,
            city:address.city,
            state:address.state,
            pincode:address.pincode
        },
        subtotal,
        shipping,
        grandTotal,
        paymentMethod:"razorpay",
        paymentStatus:"compleated",
        razorpayOrderId:razorpay_order_id,
        razorpayPaymentId:razorpay_payment_id,
        razorpaySignature:razorpay_signature
    })
    await Cart.findOneAndUpdate({userId},{$set:{products:[]}})
    req.session.appliedCoupon = null
    res.json({success:true,orderId:order._id})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Something went wrong"})
    }
}
const placeCodOrder = async (req,res) =>{
    try{
        const userId = req.session.user._id
        const {addressId} = req.body
        const address = await Address.findById(addressId)
        const{cartItems,subtotal,shipping,grandTotal} = await userService.getCartItems(userId)
        if(cartItems.length ===0){
            return res.json({success:false,message:"Cart is empty"})
        }
        let discountAmount = 0
        let finalTotal = grandTotal
        const appliedCoupon = req.session.appliedCoupon
        if(appliedCoupon){
            const coupon = await Coupon.findOne({code:appliedCoupon.code,isActive:true})
            if(coupon&& coupon.expiryDate > new Date() && grandTotal >= coupon.minAmount){
                discountAmount = coupon.discount
                finalTotal = grandTotal - discountAmount
            }
        }
       const order = await Order.create({
            userId,
            items:cartItems.map(item => ({
                productId :item.product._id,
                name:item.product.name,
                price:item.product.price,
                quantity:item.quantity,
                image:item.product.image[0]
            })),
            address :{
                name :address.name,
                mobile:String(address.mobile),
                house:address.house,
                city:address.city,
                state:address.state,
                pincode:address.pincode
            },
            subtotal,
            shipping,
            discount: discountAmount,
            grandTotal:finalTotal,
            paymentMethod:"cod",
            paymentStatus:"pending"
        })
        await Cart.findOneAndUpdate({userId},{$set:{products:[]}})
        req.session.appliedCoupon = null
        res.json({success:true,orderId :order._id})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Something went wrong"})
    }
}
const getOrders = async(req,res) =>{
    try{
        const userId = req.session.user._id
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })
        res.render("user/orders",{orders})
    }catch(error){
        console.log(error)
        res.redirect("/home")
    }
}
const getOrderDetail = async(req,res) =>{
    try{
        const orderId = req.params.id
        const order = await Order.findById(orderId)
        if(!order)return res.redirect("/orders")
        res.render("user/orderDetail",{order})
    }catch(error){
        console.log(error)
        res.redirect('/orders')
    }
}
const cancelOrder = async(req,res) =>{
    try{
        const orderId = req.params.id
        const order = await Order.findById(orderId)
        if(!order)return res.json({success:false,message:"Order not found"})
        if(order.orderStatus !== 'placed' &&order.orderStatus !== 'processing'){
            return res.json({success:false,message:'Order cannot be cancelled'})
        }
        await Order.findByIdAndUpdate(orderId,{orderStatus:'cancelled'})
        res.json({success:true})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Something went wrong"})
    }
}
const returnOrder = async(req,res) =>{
    try{
        const orderId = req.params.id
        const order = await Order.findById(orderId)
        console.log("order status:",order.orderStatus)
        if(order.orderStatus !=='delivered'){
            return res.json({success:false,message:"Only delivery orders can be returned"})
        }
        await Order.findByIdAndUpdate(orderId,{orderStatus:'returned'})
        res.json({success:true})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Something went wrong"})
    }
}

const getOrderSuccess = async (req,res) =>{
    try{
        const order = await Order.findById(req.params.orderId)
        if(!order) return res.redirect('/orders')
            res.render('user/order-success',{order})
    }catch(error){
        console.log(error)
        res.redirect('/orders')
    }
}
module.exports = {getRegister,postRegister,getLogin,postLogin,logout,getShop,getProducts,
    getHome,getHomeProducts,productDetails,getProfile,updateProfile,addAddress, deleteAddress,editAddress,
    addToCart, getCart,removeFromCart,updateCartQuantity,getCartSummary,applyCoupon,changePassword,getCheckout,
createRazorPayOrder,verifyPayment,placeCodOrder,getOrders, getOrderDetail,cancelOrder,returnOrder,getOrderSuccess }