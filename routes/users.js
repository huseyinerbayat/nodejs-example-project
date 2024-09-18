import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
    res.send('users ana sayfa')
})

router.get('/:username', (req, res) => {
    res.json({
        username: req.params.username,
    })
})

export default router