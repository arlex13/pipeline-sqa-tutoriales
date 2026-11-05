const request = require("supertest");

const app = require("../../app");
const db = require("../../app/models");
const {
  prepararBaseDePrueba,
  cerrarBaseDePrueba,
} = require("../helpers/base-de-prueba");

const Tutorial = db.tutorials;
const RUTA = "/api/tutorials";

describe("Regresión: D-01 y D-02, operaciones sobre ids inexistentes", () => {
  beforeAll(prepararBaseDePrueba);

  afterAll(cerrarBaseDePrueba);

  it("RG-01 PUT con un id inexistente responde 404", async () => {
    const res = await request(app).put(`${RUTA}/99999`).send({ title: "x" });

    expect(res.status).toBe(404);
    expect(res.body.message).toContain("Cannot update Tutorial with id=99999");
  });

  it("RG-02 PUT sin cambios a un id existente responde 200, no un 404 falso", async () => {
    // Dentro del mismo segundo, MySQL informa 0 filas afectadas cuando los datos
    // no cambian, así que 0 filas no significa que el id no exista.
    const tutorial = await Tutorial.create({ title: "Node" });
    const ruta = `${RUTA}/${tutorial.id}`;

    const primera = await request(app).put(ruta).send({ title: "Node" });
    const segunda = await request(app).put(ruta).send({ title: "Node" });

    expect(primera.status).toBe(200);
    expect(segunda.status).toBe(200);
  });

  it("RG-03 DELETE con un id inexistente responde 404", async () => {
    const res = await request(app).delete(`${RUTA}/99999`);

    expect(res.status).toBe(404);
    expect(res.body.message).toContain("Cannot delete Tutorial with id=99999");
  });
});
