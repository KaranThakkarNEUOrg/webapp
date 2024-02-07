const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASENAME,
  host: process.env.MYSQL_HOSTNAME,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
