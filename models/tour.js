import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Score from './score.js';

class Tour extends Model {}

Tour.init({
  competition_id: DataTypes.INTEGER,
  choices: DataTypes.TEXT,
  answer: DataTypes.STRING,
  time: DataTypes.INTEGER,
  day: DataTypes.INTEGER,
  month: DataTypes.INTEGER,
  year: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Tour',
});

Tour.hasMany(Score, {
  foreignKey: 'tour_id',
})

export default Tour