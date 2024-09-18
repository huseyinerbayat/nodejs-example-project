import express from "express"
import {
    getLoginController, 
    postLoginController, 
    getLogoutController, 
    getRegisterController, 
    postRegisterController,
} from '../controllers/auth.js'
import {authMiddleware} from '../middlewares/auth.js'
import { registerValidation } from "../validations/register-validation.js"

const router = express.Router()
router.get('/login', authMiddleware, getLoginController)
router.get('/register', authMiddleware, getRegisterController)
router.post('/register', registerValidation(), postRegisterController)
router.post('/login', authMiddleware, postLoginController)
router.get('/logout', getLogoutController)

export default router