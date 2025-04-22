module.exports = (err, req, res, next) => {
    console.error(err)

    return res.status(err.status || 500).json({
        success: false, 
        message: (err.errors ? err.errors[0]?.message : undefined) || err.message || "Internal server error"
    })
}