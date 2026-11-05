const db = require("../../app/models");

// sync({ force: true }) borra las tablas: nunca debe correr fuera de la base de prueba.
const prepararBaseDePrueba = async () => {
  const { database } = db.sequelize.config;
  if (!database.endsWith("_test")) {
    throw new Error(
      `Las pruebas con base de datos solo corren en una base *_test y se recibió "${database}"`,
    );
  }
  db.sequelize.options.logging = false;
  await db.sequelize.sync({ force: true });
};

const cerrarBaseDePrueba = () => db.sequelize.close();

module.exports = { prepararBaseDePrueba, cerrarBaseDePrueba };
