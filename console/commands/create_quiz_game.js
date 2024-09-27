import '../../utils/env.js'

import Pokemon from '../../models/pokemon.js'
import Competition from '../../models/competition.js'
import Tour from '../../models/tour.js'

import _ from 'lodash'
import { Sequelize } from 'sequelize'


const quizGameTypes = {
    'quiz': 'bilgi-yarismasi',
    'voice_recognition': 'ses-tanima',
}

export const createQuizGame = async (type) => {
    try {
        const validTypes = Object.keys(quizGameTypes);

        if (!validTypes.includes(type)) {
            console.log(`Invalid type provided: ${type}. Valid types are: ${validTypes.join(', ')}`);
            return
        }

        const quizGame = await Competition.findOne({
            where: {
                slug : quizGameTypes[type],
            }
        })

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        const daysInMonth = new Date(year, month, 0).getDate();

        var toursToCreated = []

        for (let day = 1; day <= daysInMonth; day++) {

            const questionCountEveryDay = 5

            const existingTours = await Tour.findAll({
                where: {
                    competition_id: quizGame.id,
                    day: day,
                    month: month,
                    year: year
                }
            });


            if(existingTours.length < questionCountEveryDay) {
                
                for (let count = 1; count <= questionCountEveryDay - existingTours.length ; count++) {
                    const pokemons = await Pokemon.findAll({
                        attributes: ['slug'],
                        limit: 4,
                        order: Sequelize.literal('RAND()')
                    })
                    
                    const randomIndex = Math.floor(Math.random() * pokemons.length);
                    const answerPokemon = pokemons[randomIndex]
    
                    toursToCreated.push({
                        competition_id: quizGame.id,
                        choices: pokemons.map(pokemon => pokemon.slug).join(','),
                        answer: answerPokemon.slug,
                        time: 30,
                        day: day,
                        month: month,
                        year: year,
                    });
                } 
            }
        }
        
        await Tour.bulkCreate(toursToCreated)
        
        console.log(`${toursToCreated.length} tours created`);

    } catch(e) {
        console.error('an error occured while creating the quiz', e);
    }
}