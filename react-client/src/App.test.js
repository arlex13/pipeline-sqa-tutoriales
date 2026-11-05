import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";
import TutorialDataService from "./services/tutorial.service";

jest.mock("./services/tutorial.service", () => ({
  __esModule: true,
  default: { getAll: jest.fn() },
}));

describe("App", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    TutorialDataService.getAll.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("FE-02 en / muestra la navegación y la lista", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "bezKoder" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add" })).toHaveAttribute(
      "href",
      "/add",
    );
    expect(await screen.findByText("Tutorials List")).toBeInTheDocument();
  });
});
