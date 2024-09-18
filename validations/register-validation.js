import { body, check } from "express-validator";
import User from "../models/user.js";

export const registerValidation = () => [
    body('username')
    .isLength({min: 3, max: 10})
    .withMessage('Username must be between 3 - 10 characters')
    .isAlphanumeric()
    .withMessage('Username must include alphanumeric characters'),

    body('email')
    .isEmail()
    .withMessage('Email is not valid')
    .custom(value => {
        return User.findByEmail(value).then(user => {
            if(user) {
                return Promise.reject('E-mail is already in use')
            }
        })
    }),

    body('password')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters'),

    body('passwordConfirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords does not match')
        }
        return true
    }),

    check('avatar').custom((value, {req}) => {
        if(!req.files || Object.keys(req.files).length === 0 || !req?.files?.avatar) {
            throw new Error('Avatar is required')
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
        const profileImage = req.files.avatar
        if(!allowedMimeTypes.includes(profileImage.mimetype)) {
            throw new Error('Invalid format')
        }
        if(profileImage.size > 5 * 1024 * 1024) {
            throw new Error('Avatar size is too large')
        }

        return true
    })
]