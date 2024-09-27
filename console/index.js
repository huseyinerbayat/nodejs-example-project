import '../utils/env.js'
import { Command } from 'commander'

import { syncPokemons } from './commands/sync_pokemons.js'
import { createQuizGame } from './commands/create_quiz_game.js'
import { createMemoryGame } from './commands/create_memory_game.js'
import { createWordCompletionGame } from './commands/create_word_completion_game.js'

const program = new Command()

program
    .command('sync:pokemons')
    .description('Pokemons syncing')
    .action(async() => {
        console.info('started pokemons syncing');
        
        await syncPokemons()

        console.info('ended pokemons syncing');
        process.exit(0)
    })

program
    .command('create:memory-game')
    .description('Create memory games')
    .action(async () => {
        console.info('creating memory games');

        await createMemoryGame()

        console.info('created memory games');
        process.exit(0)
    })

program
    .command('create:quiz-game <type>')
    .description('Create quiz games')
    .action(async (type) => {
        console.info('creating quiz games');

        await createQuizGame(type)

        console.info('created quiz games');
        process.exit(0)
    })

program
    .command('create:word-completion-game')
    .description('Create word completion games')
    .action(async () => {
        console.log('creating word completion game');
        
        await createWordCompletionGame()

        console.log('created word completion game');
        process.exit(0)
    })

program.parse(process.argv);