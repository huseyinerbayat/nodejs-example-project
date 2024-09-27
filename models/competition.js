import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Tour from './tour.js';

class Competition extends Model {}

Competition.init({
  name: DataTypes.STRING,
  slug: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'Competition',
});

Competition.hasMany(Tour, {
  foreignKey: 'competition_id',
})

export default Competition