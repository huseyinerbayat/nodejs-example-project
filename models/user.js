import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import pool from "../db.js";

class User extends Model {
  static async findByEmail(email) {
      const connection = await pool.getConnection()
      try {
          const query = 'SELECT * from users where email = :email LIMIT 1'
          const [result] = await connection.execute(query, {email}) 
          return result[0]
      } catch(e) {
          throw e
      } finally {
          connection.release()
      }
  }

  static async login(username, password) {
    const connection = await pool.getConnection()
    try {
        const query = 'SELECT * from users where username = :username and password = :password LIMIT 1'
        const [result] = await connection.execute(query, {username, password}) 
        return result[0]
    } catch(e) {
        throw e
    } finally {
        connection.release()
    }
  }
}

User.init({
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  avatar: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User',
});

export default User;
