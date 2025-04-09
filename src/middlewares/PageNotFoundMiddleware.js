module.exports = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: "Page not found"
    })
}