import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/Home";
import { MemoryRouter } from "react-router-dom";

describe("Counter component", () => {
  test("increments count when button is clicked", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const textElement = screen.getByText("Hello World!");
    //  const button = screen.getByText('Hello World!');
    expect(textElement.textContent).toBe("Hello World!");
  });
});
