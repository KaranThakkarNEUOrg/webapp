const mysql = require("mysql2");

const getHealthStatusService = async () => {
  try {
    await checkDatabaseConnection();
    return;
  } catch (error) {
    throw new Error(error);
  }
};

// Database connection check
function checkDatabaseConnection() {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASENAME,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(`Error connecting to database: ${err.message}`);
      }
      resolve(true);
    });
  });
}

module.exports = { getHealthStatusService };
