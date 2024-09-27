import './utils/env.js'
import cron from 'node-cron'

import { syncPokemons } from './console/commands/sync_pokemons.js'
import { createMemoryGame } from './console/commands/create_memory_game.js'
import { createWordCompletionGame } from './console/commands/create_word_completion_game.js'
import { createQuizGame } from './console/commands/create_quiz_game.js'


cron.schedule('0 0 * * *', async() => { await syncPokemons() }) // sync pokemons (run every day)
cron.schedule('0 0 1 * *', async() => { await createMemoryGame() }) // create memory game tours (run once a month)
cron.schedule('0 0 1 * *', async() => { await createQuizGame('quiz') }) // create quiz game tours (run once a month)
cron.schedule('0 0 1 * *', async() => { await createQuizGame('voice_recognition') }) // create quiz game tours (run once a month)
cron.schedule('0 0 1 * *', async() => { await createWordCompletionGame() }) // create word completion game tours (run once a month)