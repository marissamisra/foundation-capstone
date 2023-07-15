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

let pets = [];
let petInfoID = 0;

module.exports = {
  createPet: (req, res) => {
    const { name, photoURL, ownerID } = req.body;
    if (name === "" || photoURL === "") {
      res.status(400).send("Error creating a new pet");
      return;
    }
    const statusArray = [
      "running around somewhere",
      "chasing birds",
      "feeling loved",
      "barking at the wind",
      "loving life",
    ];
    const randomNumber = Math.floor(Math.random() * statusArray.length);
    sequelize
      .query(
        `
          INSERT INTO pets (name, photo_url, owner_id, status)
          VALUES ('${name}', '${photoURL}', ${ownerID}, '${statusArray[randomNumber]}');
        `
      )
      .then(() => {
        res.sendStatus(200);
      });
  },
  getPetInfo: async (req, res) => {
    if (petInfoID === 0) {
      res.status(400).send("No pet has been selected");
      return;
    }
    sequelize
      .query(
        `
        SELECT * FROM pets
        WHERE id = ${petInfoID}
      
      `
      )
      .then((result) => {
        console.log(result[0]);
        res.status(200).send(result[0]);
      });
  },
  getUsersPets: async (req, res) => {
    const { id } = req.query;
    const userPets = await sequelize.query(
      `
        SELECT * FROM pets
        WHERE owner_id = '${id}';
      `
    );
    res.status(200).send(userPets[0]);
  },
  storePetInfoID: (req, res) => {
    const { id } = req.params;
    petInfoID = id;
    res.sendStatus(200);
  },
};