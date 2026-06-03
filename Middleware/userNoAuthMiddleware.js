const NoAuth = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/home")
    } else {
       next()
    }
}

module.exports = NoAuth