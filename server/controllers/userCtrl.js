require("dotenv").config();
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const auth = {
  loggedInUser: { id: 1, username: "marissa" },
  isAuthenicated: false,
  login: async (req, res) => {
    const { username, password } = req.body;
    const user = await sequelize.query(
      `
      SELECT * FROM users
      WHERE username = '${username}';
      `
    );
    const isAuthorized = await bcrypt.compare(password, user[0][0].password);
    if (isAuthorized === true) {
      auth.loggedInUser = user[0][0];
      auth.isAuthenicated = true;
      delete auth.loggedInUser.password;
      console.log(`${auth.loggedInUser.username} successfully logged in`);
      res.status(200).send(auth.loggedInUser);
      return;
    }
    res.status(400).send("An error occurred during authentication");
  },
  logout: (req, res) => {
    auth.loggedInUser = {};
    auth.isAuthenticated = false;
    console.log("User logged out succesfully");
    res.sendStatus(200);
  },
  createUser: async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)

    const user = await sequelize.query(
      `
        SELECT * FROM users
        WHERE username = '${username}';
        `
    );
    if (user[0].length) {
      res.status(400).send("Username already exists");
      console.log("Error Username already exists");
      return;
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    sequelize
      .query(
        `
          INSERT INTO users (username, password)
          VALUES ('${username}', '${hash}');
          `
      )
      .then(() => {
        res.sendStatus(200);
        console.log("User Created Successfully");
        return;
      })
      .catch((err) => {
        res.status(400).send("Error creating user");
        console.log("An error occurred while creating a user", err);
      });
  },
  getUser: (req, res) => {
    sequelize
      .query(
        `
            SELECT id, username FROM users
            WHERE username = '${auth.loggedInUser.username}' 
            `
      )
      .then((result) => {
        res.status(200).send(result[0][0]);
      });
  },
};
module.exports = auth;