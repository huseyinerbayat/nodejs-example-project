import '../../utils/env.js'

import Pokemon from '../../models/pokemon.js'
import Competition from '../../models/competition.js'
import Tour from '../../models/tour.js'

import _ from 'lodash'
import { Sequelize } from 'sequelize'

export const createMemoryGame = async () => {
    try {

        const memoryGame = await Competition.findOne({
            where: {slug: 'hafiza-oyunu'}
        });

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        const daysInMonth = new Date(year, month, 0).getDate();
        let toursToCreated = []
        for (let day = 1; day <= daysInMonth; day++) {
            
            const existingTour = await Tour.findOne({
                where: {
                    competition_id: memoryGame.id,
                    day: day,
                    month: month,
                    year: year
                }
            });

            if (!existingTour) {
                
                const randomPokemons = await Pokemon.findAll({
                    attributes: ['slug'],
                    order: Sequelize.literal('RAND()'),
                    limit: 8,
                })

                var shuffledPokemons = _.shuffle([...randomPokemons, ...randomPokemons])

                toursToCreated.push({
                    competition_id: memoryGame.id,
                    choices: shuffledPokemons.map(pokemon => pokemon.slug).join(','),
                    time: 180,
                    day: day,
                    month: month,
                    year: year,
                });
                
            }
        }
        
        await Tour.bulkCreate(toursToCreated)

        console.log(`${toursToCreated.length} tours created`);

    } catch (error) {
        console.error('Error creating tours:', error);
    }
}