import express from 'express'
import Pokemon from '../models/pokemon.js'
import { Op, Sequelize } from 'sequelize'
import _ from 'lodash'
import Tour from '../models/tour.js'
import Score from '../models/score.js'
import { now } from 'sequelize/lib/utils'

const router = express.Router()

router.get('/random-pokemons', async (req, res) => {
    let randomPokemons = await Pokemon.findAll({
        attributes: ['slug', 'img_url'],
        limit: 8,
        order: Sequelize.literal('RAND()')
    })

    randomPokemons = _.shuffle([...randomPokemons, ...randomPokemons])

    res.json(randomPokemons)
})

router.get('/start-memory-game/:tourId', async (req, res) => {
    
    const tourId = req.params.tourId
    const authUser = req.session.user

    if(!authUser) {
        res.status(401)
        .json({
            status: 401,
            status_text: 'not_logged_in',
            message: 'Bu bölümü oynamak için oturum açmalısınız.',
        })
        return
    }

    const tour = await Tour.findOne({
        where: { 
            id: tourId,
        },
    })

    const desiredOrder = tour.choices.split(',')

    let randomPokemons = await Pokemon.findAll({
        attributes: ['slug', 'img_url'],
        limit: 8,
        where: {
            slug: {
                [Op.in] : desiredOrder
            }
        }
    })

    const lastPokemonList = desiredOrder.map(slug => {
        const pokemon = randomPokemons.find(p => p.slug === slug)
        return pokemon ? {slug: pokemon.slug, img_url: pokemon.img_url} : null
    }).filter(Boolean);

    if(lastPokemonList.length === 16) {

        try {
            // bu kullanıcının bu turda başlamış Score'u var mı?
            // varsa daha önceden bu bölümü oynamış demektir.
            // yoksa yeni oluştur
            
            const userScore = await Score.findOne({
                where: {
                    user_id : authUser.id,
                    tour_id: tourId,
                    start_date: {
                        [Op.ne] : null // null değil ise 
                    }
                }
            })
            
            if(!userScore) {
                const newScore = await Score.create({
                    user_id: authUser.id, // @todo
                    tour_id: tourId,
                    start_date: now()
                })
            
                if(newScore) {
                    res.json({
                        status: 200,
                        status_text: 'score_created',
                        data: lastPokemonList
                    })
                }
            }
            else {
                res.status(200)
                .json({
                    status: 200,
                    status_text: 'already_played',
                    message: 'Bu bölümü daha önce oynadınız!',
                })
            }
            
    
        } catch {
            res.status(500)
            .json({
                status: 200,
                status_text: 'server_error',
                message: 'Bir hata oluştu!',
            })
        }
    }
    else {
        res.status(500)
        .json({
            status: 500,
            status_text: 'pokemons_not_found',
            error: 'Bulunamayan pokemonlar var!'
        })
    }
})


router.post('/save-score', async (req, res) => {
    console.log("save score 3", req.body);
    const { tourId } = req.body
    const authUser = req.session.user
    
    const tour = await Tour.findOne({
        where: {
            id: tourId,
        }
    })

    if(!tour) {
        res.status(404)
        .json({
            status: 404,
            status_text: 'tour_not_found',
            message: 'Tour bulunamadı.',
        })
        return
    }

    const [affectedRows] = await Score.update(
        {
            answer_date: now(),
            score: Sequelize.literal(`${tour.time} - TIMESTAMPDIFF(SECOND, start_date, NOW())`)
        },
        {
            where: {
                user_id: authUser.id,
                tour_id: tourId,
            }
        })
        console.log("save score2");
    
    let updatedScore = null
    if (affectedRows > 0) {
        updatedScore = await Score.findOne({
            where: {
                user_id: authUser.id,
                tour_id: tourId,
            }
        });
    }

    console.log("save score");
    
    res.status(200)
    .json({
        status: 200,
        status_text: 'save_score',
        saved_score: updatedScore.score,
        message: 'Skor kaydedildi.',
    })
})


export default router