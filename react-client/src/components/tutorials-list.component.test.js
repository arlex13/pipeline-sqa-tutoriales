import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TutorialsList from "./tutorials-list.component";
import TutorialDataService from "../services/tutorial.service";

jest.mock("../services/tutorial.service", () => ({
  __esModule: true,
  default: { getAll: jest.fn(), findByTitle: jest.fn(), deleteAll: jest.fn() },
}));

const TUTORIALES = [
  { id: 1, title: "Node", description: "Curso de Node", published: true },
  { id: 2, title: "React", description: "Curso de React", published: false },
];

const mostrarLista = () =>
  render(
    <MemoryRouter>
      <TutorialsList />
    </MemoryRouter>,
  );

describe("TutorialsList", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    TutorialDataService.getAll.mockResolvedValue({ data: TUTORIALES });
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("FE-03 muestra la lista y el detalle del elegido, publicado o pendiente", async () => {
    mostrarLista();

    expect(await screen.findByText("Node")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(
      screen.getByText("Please click on a Tutorial..."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Node"));

    expect(screen.getByText("Curso de Node")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/tutorials/1",
    );

    fireEvent.click(screen.getByText("React"));

    expect(screen.getByText("Curso de React")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("FE-04 Search filtra por el título escrito", async () => {
    TutorialDataService.findByTitle.mockResolvedValue({
      data: [TUTORIALES[1]],
    });
    mostrarLista();
    await screen.findByText("Node");

    fireEvent.change(screen.getByPlaceholderText("Search by title"), {
      target: { value: "Rea" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() =>
      expect(screen.queryByText("Node")).not.toBeInTheDocument(),
    );
    expect(TutorialDataService.findByTitle).toHaveBeenCalledWith("Rea");
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("FE-05 Remove All elimina y recarga la lista", async () => {
    TutorialDataService.deleteAll.mockResolvedValue({
      data: { message: "ok" },
    });
    mostrarLista();
    await screen.findByText("Node");
    TutorialDataService.getAll.mockResolvedValue({ data: [] });

    fireEvent.click(screen.getByRole("button", { name: "Remove All" }));

    await waitFor(() =>
      expect(screen.queryByText("Node")).not.toBeInTheDocument(),
    );
    expect(TutorialDataService.deleteAll).toHaveBeenCalledTimes(1);
    expect(TutorialDataService.getAll).toHaveBeenCalledTimes(2);
  });

  it("FE-06 si getAll falla deja la lista vacía y registra el error", async () => {
    const error = new Error("fallo al listar");
    TutorialDataService.getAll.mockRejectedValue(error);

    mostrarLista();

    await waitFor(() => expect(console.log).toHaveBeenCalledWith(error));
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("FE-06 si findByTitle falla mantiene la lista y registra el error", async () => {
    const error = new Error("fallo al buscar");
    TutorialDataService.findByTitle.mockRejectedValue(error);
    mostrarLista();
    await screen.findByText("Node");

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => expect(console.log).toHaveBeenCalledWith(error));
    expect(screen.getByText("Node")).toBeInTheDocument();
  });

  it("FE-06 si deleteAll falla mantiene la lista y registra el error", async () => {
    const error = new Error("fallo al borrar");
    TutorialDataService.deleteAll.mockRejectedValue(error);
    mostrarLista();
    await screen.findByText("Node");

    fireEvent.click(screen.getByRole("button", { name: "Remove All" }));

    await waitFor(() => expect(console.log).toHaveBeenCalledWith(error));
    expect(screen.getByText("Node")).toBeInTheDocument();
  });
});
