const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  allowExitOnIdle: true,
});

pool.connect()
  .then(() => console.log("Conectado a la base de datos correctamente", process.env.DB_DATABASE))
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error.message);
  });

module.exports = pool;
