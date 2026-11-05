// Corre antes de cargar la app en cada archivo de prueba.
require("dotenv").config({ quiet: true });

// Las pruebas siempre usan la base de prueba, aunque .env apunte a otra.
process.env.DB_NAME = "tutorials_test";

// Valores del docker-compose.yml, para que `docker compose up -d mysql` baste en local.
// En CI los define el workflow y estas líneas no los cambian.
process.env.DB_HOST = process.env.DB_HOST || "127.0.0.1";
process.env.DB_USER = process.env.DB_USER || "tutorials_app";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "cambia_esto";
