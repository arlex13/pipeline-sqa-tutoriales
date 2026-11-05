jest.mock("../../app/models", () => ({
  tutorials: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Sequelize: { Op: { like: Symbol("like") } },
}));

const db = require("../../app/models");
const controller = require("../../app/controllers/tutorial.controller");

const Tutorial = db.tutorials;
const ID = { id: "7" };

const crearRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Espera a que terminen las promesas del controlador, que no devuelve la suya.
const terminar = () => new Promise((resolve) => setImmediate(resolve));

describe("tutorial.controller, con el modelo simulado", () => {
  let res;

  beforeEach(() => {
    jest.resetAllMocks();
    res = crearRes();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it.each([
    {
      operacion: "create",
      metodo: "create",
      req: { body: { title: "Node" } },
      mensaje: "fallo de base",
      registros: [],
    },
    {
      operacion: "findAll",
      metodo: "findAll",
      req: { query: {} },
      mensaje: "fallo de base",
      registros: [],
    },
    {
      operacion: "findOne",
      metodo: "findByPk",
      req: { params: ID },
      mensaje: "Error retrieving Tutorial with id=7",
      registros: [["Error retrieving Tutorial:", "fallo de base"]],
    },
    {
      operacion: "update",
      metodo: "update",
      req: { params: ID, body: { title: "Nuevo" } },
      mensaje: "Error updating Tutorial with id=7",
      registros: [["Error updating Tutorial:", "fallo de base"]],
    },
    {
      operacion: "delete",
      metodo: "destroy",
      req: { params: ID },
      mensaje: "Could not delete Tutorial with id=7",
      registros: [["Error deleting Tutorial:", "fallo de base"]],
    },
    {
      operacion: "deleteAll",
      metodo: "destroy",
      req: {},
      mensaje: "fallo de base",
      registros: [],
    },
    {
      operacion: "findAllPublished",
      metodo: "findAll",
      req: {},
      mensaje: "fallo de base",
      registros: [],
    },
  ])(
    "UT-01 $operacion responde 500 si la base falla",
    async ({ operacion, metodo, req, mensaje, registros }) => {
      Tutorial[metodo].mockRejectedValue(new Error("fallo de base"));

      controller[operacion](req, res);
      await terminar();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: mensaje });
      expect(console.error.mock.calls).toEqual(registros);
    },
  );

  it.each([
    {
      operacion: "create",
      metodo: "create",
      req: { body: { title: "Node" } },
      mensaje: "Some error occurred while creating the Tutorial.",
    },
    {
      operacion: "findAll",
      metodo: "findAll",
      req: { query: {} },
      mensaje: "Some error occurred while retrieving tutorials.",
    },
    {
      operacion: "deleteAll",
      metodo: "destroy",
      req: {},
      mensaje: "Some error occurred while removing all tutorials.",
    },
    {
      operacion: "findAllPublished",
      metodo: "findAll",
      req: {},
      mensaje: "Some error occurred while retrieving tutorials.",
    },
  ])(
    "UT-02 $operacion usa el mensaje por defecto si el error no trae uno",
    async ({ operacion, metodo, req, mensaje }) => {
      Tutorial[metodo].mockRejectedValue({});

      controller[operacion](req, res);
      await terminar();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: mensaje });
    },
  );
});
