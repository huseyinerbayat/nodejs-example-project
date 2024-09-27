'use strict';

const { now } = require('sequelize/lib/utils');
var _ = require('lodash');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const competitionNames = [
      'Hafıza Oyunu', 
      'Bilgi Yarışması',
      'Kelime Tamamlama', 
      'Ses Tanıma',
    ]

    const competitions = competitionNames.map(competitionName => {
      return {
        name: competitionName,
        slug: _.kebabCase(competitionName),
        createdAt: now(),
        updatedAt: now(),
      }
    })

    await queryInterface.bulkInsert('Competitions', competitions)
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Competitions')
  }
};
