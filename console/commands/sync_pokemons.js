import Pokedex from 'pokedex-promise-v2'
import Pokemon from '../../models/pokemon.js'
import _ from 'lodash'
import { now } from 'sequelize/lib/utils'

export const syncPokemons = async () => {
    
    const P = new Pokedex();
    var currentPage = 1
    var perPage = 20
    var maxPage = 0

    var createdPokemonCount = 0
    var updatedPokemonCount = 0
    
    while(true) {
        console.log('currentPage', currentPage);
        
        const {results, count} = await P.getPokemonsList({limit: perPage, offset: (currentPage - 1) * perPage})
        maxPage = Math.ceil(count / perPage)
        
        if (currentPage > maxPage) break
        
        const pokemonPromises = results.map(result => {
            return P.getPokemonByName(result.name)
        })

        const pokemons = await Promise.all(pokemonPromises)
        
        const pokemonList = pokemons.map(pokemon => {
            const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
            
            return {
                name: pokemonName,
                slug: _.kebabCase(pokemonName),
                img_url: pokemon.sprites.other.dream_world.front_default,
                sound_url: pokemon.cries.latest,
                createdAt: now(),
                updatedAt: now(),
            }
        })

        for (const item of pokemonList) {
            if(!item.sound_url || !item.img_url)
                continue;

            try {
                const pokemon = await Pokemon.findOne({
                    where: {
                        slug: item.slug
                    }
                })

                if (pokemon) {
                    pokemon.update(item)
                    console.log('Pokemon updated:', item.name);
                    updatedPokemonCount++
                } else {
                    Pokemon.create(item)
                    console.log('New pokemon created:', item.name);
                    createdPokemonCount++
                }

            } catch (error) {
                console.error('Error inserting pokemons:', error);
            }
        }
        currentPage++
    }
    
    console.log(`updated ${updatedPokemonCount} and created ${createdPokemonCount} pokemons`)
    
}