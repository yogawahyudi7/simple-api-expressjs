const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  port: "3307",
  user: "root",
  password: "",
  database: "universitas",
});

module.exports = db;
