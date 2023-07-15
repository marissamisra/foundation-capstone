require('dotenv').config()
const Sequelize = require('sequelize')
const { CONNECTION_STRING } = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

module.exports = {
    seedData: (req, res) => {
        sequelize.query(
            `
                DROP TABLE IF EXISTS posts;
                DROP TABLE IF EXISTS friends;
                DROP TABLE IF EXISTS pets;
                DROP TABLE IF EXISTS profile;
                DROP TABLE IF EXISTS users;

                CREATE TABLE users(
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255),
                    password VARCHAR(255)
                );

                CREATE TABLE friends(
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id),
                    friend_id INT REFERENCES users(id)
                );

                CREATE TABLE posts(
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id),
                    content VARCHAR(2500)
                );

                CREATE TABLE profile(
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id),
                    about_content VARCHAR(1000),
                    like_content VARCHAR(1000),
                    seeking_content VARCHAR(1000)
                );

                CREATE TABLE pets(
                    id SERIAL PRIMARY KEY,
                    name TEXT,
                    photo_url VARCHAR(255),
                    owner_id INT REFERENCES users(id),
                    status TEXT
                );
            `
        ).then(()=>{
            console.log('seed successful')
            res.status(200).send('seed successful')
        })
    }
}
