import './utils/env.js'
import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'

import session from 'express-session'
import fileUpload from 'express-fileupload'

import { plusOne } from './utils/helper_functions.js'
const app = express()
const port = process.env.PORT || 3000

import users from './routes/users.js'
import auth from './routes/auth.js'

app.set('view engine', 'ejs')
app.use(fileUpload( {
    //safeFileNames: true,
    //preserveExtension: true,
}))
app.use('/uploads', express.static('uploads'))
app.use('/assets', express.static('assets'))

app.use(expressEjsLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        /*cookie: {
            secure: true,
        }*/
    })
)

app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.plusOne = plusOne
    next()
})

app.get('/', (req, res) => {

    res.render('index', {
        title: 'Home Page',
    })
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact',
        heading: 'Fill the blank',
    })
})

app.post('/contact',(req, res) => {
    const {name} = req.body

    res.render('contact', {
        title: 'Contact',
        heading: `Thank you ${name}`,
    })
})

app.use('/users', users) // user routes
app.use('/auth', auth) // auth routes

app.use((req, res) => {
    res.status(404).send('Page not found')
})

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
})