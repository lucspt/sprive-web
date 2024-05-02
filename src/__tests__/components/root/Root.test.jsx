import { expect, describe, it } from "vitest"
import { renderWithRouter } from "../../utils";
import { Root } from "../../../Root";
import { waitFor, screen } from "@testing-library/react";

describe("Root", () => {


  it("Renders the root grid", async () => {
    renderWithRouter(
      <Root />,
      "/",
      {},
    )

    await waitFor(() => {
      expect(screen.getByTestId("root-grid"));
    })
  });
  
});
