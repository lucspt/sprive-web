import { describe, expect } from "vitest";
import { renderWithRouter } from "./utils";
import { screen, waitFor } from "@testing-library/react";
import Ecosystem, {
  loader as ecosystemLoader
} from "../components/ecosystem/Ecosystem";
import userEvent from "@testing-library/user-event";
import { Crown } from "../components/crown/Crown";
import { Login } from "../components/login/Login";

const testRoute = async (ariaLabel, waitForText) => {
  const link = screen.getByRole("link", { name: ariaLabel });
  expect(link).toBeInTheDocument();

  await userEvent.click(link);
  await waitFor(() => {
    expect(screen.getByText(waitForText)).toBeInTheDocument();
  });
};

describe("Crown", () => {
  
  it("Renders working links", async () => {
    // Root already renders Crown, so we don't need to render it here.
    renderWithRouter(
      <Crown />, 
      "/", 
      undefined,
      [
        { path: "/ecosystem", element: <Ecosystem />, loader: ecosystemLoader},
        { path: "/login", element: <Login />},
      ]
    );

    testRoute("the ecosystem", "The Ecosystem");
    testRoute("login", "Email");
  });
  
});

