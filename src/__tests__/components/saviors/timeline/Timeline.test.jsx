import { renderWithRouter } from "../../../utils";
import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Timeline } from "../../../../components/saviors/timeline/Timeline";
import { setupEmptyTasks, setupBehindTasks, setupTasksDue, setupAllTasksComplete } from "./msw";
import { timelineLoader } from "../../../../components/saviors/timeline/loader";

const _render = (extraRoutes) => {
  renderWithRouter(
    <Timeline />,
    "/saviors/timeline",
    { loader: timelineLoader },
    extraRoutes,
  )
}
describe("Timeline", () => {

  it("Renders a header", async function() {
    setupEmptyTasks();
    _render();

    await waitFor(() => {
      expect(screen.getByText("Timeline")).toBeInTheDocument();
    });
  });
  
  describe("When behind datasets by a month", () => {
    beforeEach(() => {
      setupBehindTasks()
      _render();
    });
  
    it("Renders a `You are behind...` warning", async () => {
      await waitFor(() => {
        expect(screen.getByText(/You are behind/, { exact: false }));
      });  
    });
  });
  
  describe("When dataset uploads are due this month", () => {
    beforeEach(() => {
      setupTasksDue();
      _render()
    })

    it("Renders a `You have N datasets left warning", async () => {
      await waitFor(() => {
        expect(screen.getByText(/You have \d datasets left/));
      });
    });
  });

  describe("When dataset uploads are complete", () => {
    beforeEach(() => {
      setupAllTasksComplete();
      _render();
    })
    it("Renders a `Complete` message", async () => {
      await waitFor(() => {
        const completeMessage = screen.getByText("Complete");
        // checks for a checkmark symbol lol
        ["Complete", "check"].map(txt => expect(completeMessage.textContent).toContain(txt));
      })
    })
  })

});