import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Pokemon extends Model {}

Pokemon.init({
  name: DataTypes.STRING,
  slug: DataTypes.STRING,
  img_url: DataTypes.STRING,
  sound_url: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Pokemon',
});

export default Pokemon
