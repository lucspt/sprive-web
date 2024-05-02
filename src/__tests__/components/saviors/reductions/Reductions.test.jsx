import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { canvasTestingBeforeEach, renderWithRouter } from "../../../utils";
import { Reductions } from "../../../../components/saviors/reductions/Reductions";
import { reductionsLoader as loader } from "../../../../components/saviors/reductions/loader";
import { setupEmptyHadlers, setupHandlers } from "./msw";

const _render = () => {
  renderWithRouter(
    <Reductions />,
    "/saviors/reductions",
    { loader }
  );
}
describe("Reductions", () => {

  it("Renders header", async () => {
    setupEmptyHadlers();
    _render();
    await waitFor(() => {
      expect(screen.getByText("Reductions")).toBeInTheDocument();
    });
  });

  describe("When logs are empty", () => {
    beforeEach(() => {
      setupEmptyHadlers();
      _render();
    })

    it("Shows a measurement CTA", async () => {
      await waitFor(() => {
        expect(screen.getByText("Measure")).toBeInTheDocument();
      });
    });

    it("Doesn't show a create pledge button", () => {
      expect(
        screen.queryByText("Create pledge", { exact: false })
      ).not.toBeInTheDocument();
    });

    it("Renders table with no results", async () => {
      await waitFor(() =>  {
        const pledgesTable = screen.getByTestId("pledges-table");
        expect(pledgesTable.textContent).toContain("No results");
      })
    })
  });

  describe("When logs are present", () => {
    beforeEach(() => {
      canvasTestingBeforeEach(global);
      setupHandlers();
      _render();
    });

    it("Shows reduction charts", async () => {
     await waitFor(() => {
        expect(
          screen.queryAllByTestId("reduction-chart").length
          ).toBeGreaterThan(0);
        });
    });

    it("Shows pledges table", async () => {
      await waitFor(() => {
        expect(
          screen.getByText("Pledges")
        ).toBeInTheDocument();
        // const pledgesTable = screen.getByTestId("pledges-table");
        // TODO: start pledges table
        // expect(pledgesTable.textContent).not.toContain("No results");
      });
      
    });

  });
 

})