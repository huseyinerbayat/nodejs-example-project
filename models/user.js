import pool from "../db.js";

class User {

    static async create(data) {
        const connection = await pool.getConnection()
        try {
            const query = 'INSERT INTO users SET email = :email, username = :username, password = :password, avatar = :avatar'
            const [result] = await connection.execute(query, data,
                (err, result) => {
                    if(err) {
                        throw err
                    }
                    console.log('create user successfully', result);
                }
            )

            return result
            
        } catch(e) {
            throw e
        } finally {
            connection.release()
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection()
        try {
            const query = 'SELECT * from users where id = :id LIMIT 1'
            const [result] = await connection.execute(query, {id}) 
            return result[0]
        } catch(e) {
            throw e
        } finally {
            connection.release()
        }
    }

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

export default User