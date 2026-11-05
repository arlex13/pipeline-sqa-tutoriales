import http from "../http-common";
import TutorialDataService from "./tutorial.service";

// Se simula axios y no http-common, para que esa configuración también corra.
jest.mock("axios", () => {
  const instancia = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return { __esModule: true, default: { create: () => instancia } };
});

const RESPUESTA = { data: "ok" };
const DATOS = { title: "Node" };

describe("TutorialDataService", () => {
  it.each([
    { metodo: "getAll", args: [], verbo: "get", esperado: ["/tutorials"] },
    { metodo: "get", args: [5], verbo: "get", esperado: ["/tutorials/5"] },
    {
      metodo: "create",
      args: [DATOS],
      verbo: "post",
      esperado: ["/tutorials", DATOS],
    },
    {
      metodo: "update",
      args: [5, DATOS],
      verbo: "put",
      esperado: ["/tutorials/5", DATOS],
    },
    {
      metodo: "delete",
      args: [5],
      verbo: "delete",
      esperado: ["/tutorials/5"],
    },
    {
      metodo: "deleteAll",
      args: [],
      verbo: "delete",
      esperado: ["/tutorials"],
    },
    {
      metodo: "findByTitle",
      args: ["node"],
      verbo: "get",
      esperado: ["/tutorials?title=node"],
    },
  ])(
    "FE-01 $metodo llama a su ruta con $verbo",
    async ({ metodo, args, verbo, esperado }) => {
      http[verbo].mockResolvedValue(RESPUESTA);

      await expect(TutorialDataService[metodo](...args)).resolves.toBe(
        RESPUESTA,
      );

      expect(http[verbo]).toHaveBeenCalledWith(...esperado);
    },
  );
});
