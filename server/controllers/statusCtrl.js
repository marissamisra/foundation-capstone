require('dotenv').config()
const Sequelize = require("sequelize");
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
    updateStatus: (req, res) => {
        const { newStatus, petID } = req.body
        console.log(newStatus, petID)
        sequelize.query(
            `
                UPDATE pets
                SET status = '${newStatus}'
                WHERE id = ${petID};
            `
        ).then(result => {
            console.log(result[0])
        })
    }
}