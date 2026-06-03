const userApiauth = (req, res, next) => {
    if (req.session.user) {
         next()
    } else {
        
        res.status(401).json({success:false}) 
    }
}
module.exports = userApiauth 