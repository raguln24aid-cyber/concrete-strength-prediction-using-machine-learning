import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

test("renders landing page brand", () => {
  render(<MemoryRouter><LandingPage /></MemoryRouter>);
  expect(screen.getAllByText(/ConcreteMix AI/i).length).toBeGreaterThan(0);
});
