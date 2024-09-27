export const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/')
    }
    next()
}