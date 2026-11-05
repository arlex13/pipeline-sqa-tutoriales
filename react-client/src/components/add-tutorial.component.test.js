import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import AddTutorial from "./add-tutorial.component";
import TutorialDataService from "../services/tutorial.service";

jest.mock("../services/tutorial.service", () => ({
  __esModule: true,
  default: { create: jest.fn() },
}));

const escribir = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), {
    target: { value: valor },
  });

const enviar = () =>
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

describe("AddTutorial", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("FE-07 envía los datos, muestra el éxito y Add vuelve al formulario vacío", async () => {
    TutorialDataService.create.mockResolvedValue({
      data: { id: 1, title: "Node", description: "Curso", published: false },
    });
    render(<AddTutorial />);

    escribir("Title", "Node");
    escribir("Description", "Curso");
    enviar();

    expect(
      await screen.findByText("You submitted successfully!"),
    ).toBeInTheDocument();
    expect(TutorialDataService.create).toHaveBeenCalledWith({
      title: "Node",
      description: "Curso",
    });

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
  });

  it("FE-08 si create falla sigue en el formulario y registra el error", async () => {
    const error = new Error("fallo al crear");
    TutorialDataService.create.mockRejectedValue(error);
    render(<AddTutorial />);
    escribir("Title", "Node");

    enviar();

    await waitFor(() => expect(console.log).toHaveBeenCalledWith(error));
    expect(screen.getByLabelText("Title")).toHaveValue("Node");
    expect(
      screen.queryByText("You submitted successfully!"),
    ).not.toBeInTheDocument();
  });
});
