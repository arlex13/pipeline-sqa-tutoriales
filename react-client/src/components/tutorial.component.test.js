import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Tutorial from "./tutorial.component";
import TutorialDataService from "../services/tutorial.service";

jest.mock("../services/tutorial.service", () => ({
  __esModule: true,
  default: { get: jest.fn(), update: jest.fn(), delete: jest.fn() },
}));

const PENDIENTE = {
  id: 1,
  title: "Node",
  description: "Curso de Node",
  published: false,
};
const EXITO = "The tutorial was updated successfully!";

const mostrarTutorial = () =>
  render(
    <MemoryRouter initialEntries={["/tutorials/1"]}>
      <Routes>
        <Route path="/tutorials/:id" element={<Tutorial />} />
        <Route path="/tutorials" element={<p>Lista de tutoriales</p>} />
      </Routes>
    </MemoryRouter>,
  );

const pulsar = (nombre) =>
  fireEvent.click(screen.getByRole("button", { name: nombre }));

describe("Tutorial", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    TutorialDataService.get.mockResolvedValue({ data: PENDIENTE });
    TutorialDataService.update.mockResolvedValue({ data: { message: "ok" } });
    TutorialDataService.delete.mockResolvedValue({ data: { message: "ok" } });
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("FE-09 carga el tutorial de la ruta; Update envía los cambios y muestra el éxito", async () => {
    mostrarTutorial();

    expect(await screen.findByDisplayValue("Node")).toBeInTheDocument();
    expect(TutorialDataService.get).toHaveBeenCalledWith("1");
    expect(screen.getByLabelText("Description")).toHaveValue("Curso de Node");
    expect(screen.getByText("Pending")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Node avanzado" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Curso largo" },
    });
    pulsar("Update");

    expect(await screen.findByText(EXITO)).toBeInTheDocument();
    expect(TutorialDataService.update).toHaveBeenCalledWith(1, {
      id: 1,
      title: "Node avanzado",
      description: "Curso largo",
      published: false,
    });
  });

  it("FE-10 Publish marca el tutorial como publicado", async () => {
    mostrarTutorial();
    await screen.findByDisplayValue("Node");

    pulsar("Publish");

    expect(
      await screen.findByRole("button", { name: "UnPublish" }),
    ).toBeInTheDocument();
    expect(TutorialDataService.update).toHaveBeenCalledWith(1, {
      id: 1,
      title: "Node",
      description: "Curso de Node",
      published: true,
    });
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("FE-10 UnPublish marca el tutorial como pendiente", async () => {
    TutorialDataService.get.mockResolvedValue({
      data: { ...PENDIENTE, published: true },
    });
    mostrarTutorial();
    await screen.findByDisplayValue("Node");

    pulsar("UnPublish");

    expect(
      await screen.findByRole("button", { name: "Publish" }),
    ).toBeInTheDocument();
    expect(TutorialDataService.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ published: false }),
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("FE-11 Delete elimina y navega a la lista", async () => {
    mostrarTutorial();
    await screen.findByDisplayValue("Node");

    pulsar("Delete");

    expect(await screen.findByText("Lista de tutoriales")).toBeInTheDocument();
    expect(TutorialDataService.delete).toHaveBeenCalledWith(1);
  });

  it("FE-12 si get falla registra el error", async () => {
    const error = new Error("fallo al cargar");
    TutorialDataService.get.mockRejectedValue(error);

    mostrarTutorial();

    await waitFor(() => expect(console.log).toHaveBeenCalledWith(error));
    expect(screen.getByLabelText("Title")).toHaveValue("");
  });

  it("FE-12 si update falla registra el error y no muestra éxito", async () => {
    const error = new Error("fallo al actualizar");
    TutorialDataService.update.mockRejectedValue(error);
    mostrarTutorial();
    await screen.findByDisplayValue("Node");

    pulsar("Publish");
    pulsar("Update");

    await waitFor(() =>
      expect(console.log.mock.calls.filter(([x]) => x === error)).toHaveLength(
        2,
      ),
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.queryByText(EXITO)).not.toBeInTheDocument();
  });

  it("FE-12 si delete falla sigue en la página y registra el error", async () => {
    const error = new Error("fallo al eliminar");
    TutorialDataService.delete.mockRejectedValue(error);
    mostrarTutorial();
    await screen.findByDisplayValue("Node");

    pulsar("Delete");

    await waitFor(() => expect(console.log).toHaveBeenCalledWith(error));
    expect(screen.getByDisplayValue("Node")).toBeInTheDocument();
    expect(screen.queryByText("Lista de tutoriales")).not.toBeInTheDocument();
  });
});
