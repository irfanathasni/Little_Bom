require("dotenv").config();
const express = require("express")
const app = express()
const session = require("express-session")
const {MongoStore} = require("connect-mongo")
const connectDB = require(`./config/db`)
connectDB()
app.use(express.json())
app.use(session({
    secret:"yourSecretKeyHere",
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: "session"
    })
}))
app.set("view engine","ejs")
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next()
})
const adminRoutes = require(`./routes/adminRoutes`)
const userRoutes = require(`./routes/userRoutes`)
app.use("/uploads",express.static("uploads"))
app.use(`/admin`,adminRoutes)
app.use("/",userRoutes)
app.use((req,res) =>{
    res.status(404).render(`404`)
})
app.listen(3000,() => {
    console.log("server Running on port 3000")
})