import '../../utils/env.js'

import Pokemon from '../../models/pokemon.js'
import Competition from '../../models/competition.js'
import Tour from '../../models/tour.js'

import _ from 'lodash'
import { Sequelize } from 'sequelize'

export const createWordCompletionGame = async () => {
    try {

        const quizGame = await Competition.findOne({
            where: {
                slug : 'kelime-tamamlama',
            }
        })

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        const daysInMonth = new Date(year, month, 0).getDate();

        var toursToCreated = []
        const questionCountEveryDay = 5

        for (let day = 1; day <= daysInMonth; day++) {

            const existingTours = await Tour.findAll({
                where: {
                    competition_id: quizGame.id,
                    day: day,
                    month: month,
                    year: year
                }
            });

            if(existingTours.length < questionCountEveryDay) {
                
                const pokemons = await Pokemon.findAll({
                    attributes: ['slug'],
                    limit: questionCountEveryDay - existingTours.length,
                    order: Sequelize.literal('RAND()')
                })
                const newTours = pokemons.map(pokemon => {
                    return {
                        competition_id: quizGame.id,
                        choices: pokemon.slug,
                        answer: pokemon.slug,
                        time: 30,
                        day: day,
                        month: month,
                        year: year,
                    };
                })

                toursToCreated.push(newTours) 
            }
        }

        toursToCreated =toursToCreated.flat()
        await Tour.bulkCreate(toursToCreated)
        
        console.log(`${toursToCreated.length} tours created for world completion game`);

    } catch(e) {
        console.error('an error occured while creating the word completion game', e);
    }
}