import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Score extends Model {}

Score.init({
  user_id: DataTypes.INTEGER,
  tour_id: DataTypes.INTEGER,
  score: DataTypes.INTEGER,
  user_answer: DataTypes.STRING,
  answer_date: DataTypes.DATE,
  start_date: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Score',
});

export default Score