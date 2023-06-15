const { Pool, Client } = require("pg");

const connection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.MYSQL_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

connection.query("SELECT NOW()", (err, connnectionres) => {
  if (err) throw err;
  console.log("Successfully connected to the 🟢 database.");
});

module.exports = connection;
