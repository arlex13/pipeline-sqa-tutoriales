const request = require("supertest");

const app = require("../../app");
const db = require("../../app/models");
const {
  prepararBaseDePrueba,
  cerrarBaseDePrueba,
} = require("../helpers/base-de-prueba");

const Tutorial = db.tutorials;
const RUTA = "/api/tutorials";

describe("API de tutoriales contra MySQL", () => {
  beforeAll(prepararBaseDePrueba);

  beforeEach(async () => {
    await Tutorial.destroy({ where: {} });
  });

  afterAll(cerrarBaseDePrueba);

  it("IT-01 POST crea un tutorial y lo guarda en la base", async () => {
    const res = await request(app)
      .post(RUTA)
      .send({ title: "Node", description: "Curso de Node" });

    expect(res.ok).toBe(true);
    expect(res.body).toMatchObject({
      title: "Node",
      description: "Curso de Node",
      published: false,
    });
    expect(res.body.id).toEqual(expect.any(Number));

    const guardado = await Tutorial.findByPk(res.body.id);
    expect(guardado.title).toBe("Node");
  });

  it("IT-02 POST sin title responde 400 y no guarda nada", async () => {
    const res = await request(app)
      .post(RUTA)
      .send({ description: "sin título" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Content can not be empty!" });
    expect(await Tutorial.count()).toBe(0);
  });

  it("IT-03 GET lista todos los tutoriales", async () => {
    await Tutorial.bulkCreate([{ title: "Node" }, { title: "React" }]);

    const res = await request(app).get(RUTA);

    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.title).sort()).toEqual(["Node", "React"]);
  });

  it("IT-04 GET con title filtra por coincidencia parcial", async () => {
    await Tutorial.bulkCreate([{ title: "Curso de Node" }, { title: "React" }]);

    const res = await request(app).get(RUTA).query({ title: "Node" });

    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.title)).toEqual(["Curso de Node"]);
  });

  it("IT-05 GET /published lista solo los publicados", async () => {
    await Tutorial.bulkCreate([
      { title: "Publicado", published: true },
      { title: "Pendiente", published: false },
    ]);

    const res = await request(app).get(`${RUTA}/published`);

    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.title)).toEqual(["Publicado"]);
  });

  it("IT-06 GET /:id responde el tutorial", async () => {
    const tutorial = await Tutorial.create({ title: "Node" });

    const res = await request(app).get(`${RUTA}/${tutorial.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: tutorial.id, title: "Node" });
  });

  it("IT-07 GET /:id con un id inexistente responde 404", async () => {
    const res = await request(app).get(`${RUTA}/99999`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Cannot find Tutorial with id=99999.",
    });
  });

  it("IT-08 PUT /:id con un campo distinto guarda el cambio", async () => {
    const tutorial = await Tutorial.create({ title: "Antes" });

    const res = await request(app)
      .put(`${RUTA}/${tutorial.id}`)
      .send({ title: "Después" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Tutorial was updated successfully." });

    await tutorial.reload();
    expect(tutorial.title).toBe("Después");
  });

  it("IT-09 DELETE /:id elimina el tutorial", async () => {
    const tutorial = await Tutorial.create({ title: "Node" });

    const res = await request(app).delete(`${RUTA}/${tutorial.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Tutorial was deleted successfully!" });
    expect(await Tutorial.findByPk(tutorial.id)).toBeNull();
  });

  it("IT-10 DELETE elimina todos e informa la cantidad", async () => {
    await Tutorial.bulkCreate([{ title: "Node" }, { title: "React" }]);

    const res = await request(app).delete(RUTA);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "2 Tutorials were deleted successfully!",
    });
    expect(await Tutorial.count()).toBe(0);
  });
});
