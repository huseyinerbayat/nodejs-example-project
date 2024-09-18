import { validationResult } from "express-validator"
import slugify from "slugify"
import User from "../models/user.js"

export const getRegisterController = (req, res) => {
    res.render('auth/register', { title: 'Register' })
}

export const getLoginController = (req, res) => {
    res.render('auth/login', { title: 'Login' })
}


export const postLoginController = async (req, res) => {

    res.locals.formData = req.body
    const {username, password} = req.body
    let error = ''
    if(!username) {
        error = 'Username is required'
    } else if (!password) {
        error = 'Password is required'
    } else {
        
        const user = await User.login(username, password)
        if(user) {
            req.session.username = user.username
            req.session.user_id = user.id
            return res.redirect('/')
        } else {
            error = 'Invalid username or password'
        }
        
    }
    
    res.render('auth/login', {
        error
    })
}


export const getLogoutController = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}


export const postRegisterController = (req, res) => {
    res.locals.formData = req.body
   
    const errors = validationResult(req)
    
    if(errors.isEmpty()) {

        let avatar = req.files.avatar
        var path = 'uploads/' + Date.now() + '-' + slugify(avatar.name, {
            lower: true,
            locale: 'tr',
        })
        avatar.mv(path, async err => {
            if(err) {
                console.log('Error while uploading avatar');
                
                return res.status(500).send(err)
            }
            console.log('Upload is success');
            const data = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: path,
            }

            const response = await User.create(data)
            const user = await User.findById(response.insertId)

            req.session.username = user.username
            req.session.user_id = user.id

            res.redirect('/')
            
        })
    }
    else {
        res.render('auth/register', {
            errors: errors.array()
        })
    }
}