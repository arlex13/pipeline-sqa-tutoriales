const request = require("supertest");

const app = require("../../app");
const {
  prepararBaseDePrueba,
  cerrarBaseDePrueba,
} = require("../helpers/base-de-prueba");

describe("Regresión: D-03, crear un tutorial responde 201", () => {
  beforeAll(prepararBaseDePrueba);

  afterAll(cerrarBaseDePrueba);

  it("RG-04 POST responde 201 con el tutorial creado", async () => {
    const res = await request(app)
      .post("/api/tutorials")
      .send({ title: "Node", description: "Curso de Node" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Node",
      description: "Curso de Node",
      published: false,
    });
  });
});
