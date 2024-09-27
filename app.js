import './utils/env.js'
import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'

import session from 'express-session'
import fileUpload from 'express-fileupload'

import { plusOne } from './utils/helper_functions.js' // kullanımını öğrenmek için yapıldı

const app = express()
const port = process.env.PORT || 3000

/** routes */
import users from './routes/users.js'
import auth from './routes/auth.js'
import apiRoutes from './routes/api.js'
/** routes */

/** models */
import Pokemon from './models/pokemon.js'
import Competition from './models/competition.js'
import Tour from './models/tour.js'
import Score from './models/score.js'
/** models */

import { Op, Sequelize } from 'sequelize'
import _ from 'lodash'


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
        cookie: {
            secure: process.env.COOKIE_SECURITY || false,
            maxAge: 24 * 60 * 60 * 1000 // 24 saat
        },
    })
)
app.use(express.json()) // json olarak gelen verileri karşılayabilmek için eklendi

app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.plusOne = plusOne
    next()
})

app.get('/', (req, res) => {

    res.render('index', {
        title: 'Ana Sayfa',
    })
})

app.get('/pokemons', async (req, res) => {
    const perPage = 12
    const page = req.query.page || 1

    const count = await Pokemon.count()
    const pokemons = await Pokemon.findAll({limit: perPage, offset: (page - 1) * perPage})

    res.render('pokedex', {
        title: 'Pokemonlar',
        pokemons: pokemons,
        page: page,
        maxPage: Math.ceil(count / perPage)
    })
})

app.get('/hafiza-oyunu', async (req, res) => {
    const authUser = req.session?.user
    const memoryGame = await Competition.findOne({
        where: {
            slug: 'hafiza-oyunu'
        },
    });

    const date = new Date()
    
    const tours = await Tour.findAll({
        where: {
            competition_id: memoryGame.id,
            month: date.getMonth() + 1,
            day: {[Op.lte] : date.getDate() },
        },
        order: [['day', 'asc']],
        include: {
            model: Score,
            where: {
                user_id: authUser ? authUser?.id : null
            },
            required: false,
        }
    })

    const randomPokemons = await Pokemon.findAll({
        order: Sequelize.literal('RAND()'),
        limit: 8,
    })

    const trialGamePokemons = _.shuffle([...randomPokemons, ...randomPokemons])


    res.render('memory-game', {
        title: 'Hafıza Oyunu',
        tours: tours,
        trialGamePokemons: trialGamePokemons,
    })
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'İletişim',
        heading: 'Fill the blank',
    })
})

app.post('/contact',(req, res) => {
    const {name} = req.body

    res.render('contact', {
        title: 'İletişim',
        heading: `Thank you ${name}`,
    })
})

app.use('/users', users) // user routes
app.use('/auth', auth) // auth routes
app.use('/api', apiRoutes)

app.use((req, res) => {
    res.status(404).send('Page not found')
})

app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
})