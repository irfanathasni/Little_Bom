const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const Product = require("../models/productModel") 
const Catagory = require("../models/catagoryModel")
const Address = require("../models/addressModel")
const Cart = require("../models/cartModel")
const Coupon = require("../models/couponModel")

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email })
    if (existingUser) throw new Error("Email already registered")
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })
    return user
}

const loginUser = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error("User not found")
    if (user.isBlocked) throw new Error("Your account is blocked")
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error("Incorrect password")
    return user
}

const fetchProducts = async (search, category, sort, page) => {
    const query = { isActive: true }
    const limit = 10
    const currentPage = parseInt(page) || 1
    const skip = (currentPage - 1) * limit
    const sortOption = {}
    if (search) query.name = { $regex: search, $options: "i" }
    if (category) query.category = category
    if (sort === "low") sortOption.price = 1
    if (sort === "high") sortOption.price = -1
    const products = await Product.find(query).populate("category").skip(skip).limit(limit).sort(sortOption)
    const categories = await Catagory.find({ isActive: true })
    const total = await Product.countDocuments(query)
    const totalPages = Math.ceil(total / limit)
    return { products, categories, currentPage, totalPages }
}

const getproductDetails = async (productId) => {
    try {
        const product = await Product.findById(productId)
        return product
    } catch (error) {
        throw error
    }
}

const updateProfile = async (userId, name, email) => {
    try {
        await User.findByIdAndUpdate(userId, { name, email })
    } catch (error) {
        throw error
    }
}

const addAddress = async (userId, data) => {
    try {
        await Address.create({
            userId,
            name: data.name,
            mobile: data.mobile,
            house: data.house,
            state: data.state,
            city: data.city,
            pincode: data.pincode
        })
    } catch (error) {
        throw error
    }
}

const deleteAddress = async (addressId) => {
    try {
        await Address.findByIdAndDelete(addressId)
    } catch (err) {
        throw err
    }
}

const editAddress = async (addressId, data) => {
    try {
        await Address.findByIdAndUpdate(addressId, {
            name: data.name,
            mobile: data.mobile,
            house: data.house,
            city: data.city,
            state: data.state,
            pincode: data.pincode
        })
    } catch (error) {
        throw error
    }
}

const addToCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ userId })
        if (!cart) {
            await Cart.create({ userId, products: [{ productId, quantity: 1 }] })
            return
        }
        const existingProduct = cart.products.find((item) =>
            item.productId.toString() === productId)
        if (existingProduct) {
            existingProduct.quantity += 1
            await cart.save()
        } else {
            cart.products.push({ productId, quantity: 1 })
            await cart.save()
        }
    } catch (error) {
        throw error
    }
}

const getCartItems = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate("products.productId")
    if (!cart || cart.products.length === 0) {
        return { cartItems: [], total: 0 }
    }
    const cartItems = cart.products
        .filter(item => item.productId !== null)
        .map(item => ({
            product: item.productId,
            quantity: item.quantity,
            subtotal: item.productId.price * item.quantity
        }))
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
    const shipping = 80
    const grandTotal = total + shipping
    return { cartItems, subtotal: total, shipping, grandTotal }
}

const removeCartItem = async (userId, productId) => {
    await Cart.updateOne({ userId }, { $pull: { products: { productId: productId } } })
}

const updateCartQuantity = async (userId, productId, quantity) => {
    await Cart.updateOne(
        { userId, "products.productId": productId },
        { $set: { "products.$.quantity": quantity } }
    )
}

const applyCoupon = async (userId, code) => {
    const coupon = await Coupon.findOne({ code, isActive: true, isDeleted: false })
    if (!coupon) return { success: false, message: "Invalid coupon code" }
    if (coupon.expiryDate < new Date()) return { success: false, message: "Coupon has expired" }
    const { grandTotal } = await getCartItems(userId)
    if (grandTotal < coupon.minAmount) return { success: false, message: `Minimum order amount is ₹${coupon.minAmount}` }
    const discount = coupon.discount
    const newTotal = grandTotal - discount
    return { success: true, discount, newTotal }
}

const updatePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId)
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return { success: false, message: "Current password is incorrect" }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    return { success: true, message: "Password updated successfully" }
}

const getCartSummary = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate("products.productId")
    if (!cart || cart.products.length === 0) {
        return { cartItems: [], subtotal: 0, shipping: 0, grandTotal: 0 }
    }
    const cartItems = cart.products
        .filter(item => item.productId !== null)
        .map(item => ({
            product: item.productId,
            quantity: item.quantity,
            subtotal: item.productId.price * item.quantity
        }))
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
    const shipping = 80
    const grandTotal = subtotal + shipping
    return { cartItems, subtotal, shipping, grandTotal }
}

module.exports = {
    registerUser, loginUser, fetchProducts,
    getproductDetails, updateProfile, addAddress,
    deleteAddress, editAddress, addToCart, getCartItems,
    removeCartItem, updateCartQuantity, applyCoupon,
    updatePassword, getCartSummary
}