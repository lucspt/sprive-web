import { beforeEach, describe, expect, it, } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { canvasTestingBeforeEach, renderWithRouter } from "../../../utils";
import { Emissions } from "../../../../components/saviors/emissions/Emissions";
import { emissionsLoader as loader } from "../../../../components/saviors/emissions/loader";
import { createCsvFilename, logsToCsv } from "../../../../components/saviors/emissions/utils";
import { setupEmptyDataHandler } from "../../../utils";
import { setupLogsHandler } from "./msw";
import { defaultMockLogs } from "../../../msw/mock-data";

const  _render = () => {
  return renderWithRouter(<Emissions />, "/saviors/emissions", { loader });
};

describe("Emissions", () => {
  describe("When logs are empty", () => {
    beforeEach(() => setupEmptyDataHandler("saviors/logs"));

    it("A start measuring CTA is visible", async () => {
      _render();
      await waitFor(() => { 
        expect(screen.getByText(/No data/)).toBeInTheDocument();
        expect(screen.getByText("Measure")).toBeInTheDocument();
      });
    });
  }); 

  describe("When logs are present", () => {
    beforeEach(() => {
      canvasTestingBeforeEach(global);
      // setupLogsHandler();
    });
 
    it("Emissions per month bar is rendered", async () => {
      _render();
      
      await waitFor(() => {
        expect(screen.getByTestId("monthly-emissions-bar")).toBeInTheDocument()
      });
    }); 

    it("Emissions by scope doughnut is rendered", async () => {
      _render();
      await waitFor(() => {
        expect(screen.getByTestId("scope-emissions-doughnut")).toBeInTheDocument();
      });
    })
    
    describe("Emissions by scope table", () => {
      const mockLog = defaultMockLogs[0];
      it("Is rendered", async () => {
        _render();
  
        await waitFor(() => {
          expect(screen.getByText("Breakdown")).toBeInTheDocument();
          expect(screen.getByText("Total Emissions")).toBeInTheDocument();
        });
      });

      it("Renders a downloadable anchor", async () => {
        _render()

        await waitFor(() => {
          const downloadLink = screen.getByTestId("download-emissions");
          expect(downloadLink).toHaveAttribute("download", createCsvFilename(defaultMockLogs))
          expect(downloadLink).toHaveAttribute("href", logsToCsv(defaultMockLogs));
        });
      })
      
      it("Scopes are interactive (expandable and modal popup)", async () => {
        _render();
        
        await waitFor(async () => {
          const expandableScope = screen.getByText(`Scope ${mockLog.scope}`, {exact: false});
          act(() => fireEvent.click(expandableScope));
          const activityLog = await screen.findByText(mockLog.activity);
          act(() => fireEvent.click(activityLog))
          expect(screen.getByTestId("log-popup")).toBeInTheDocument();
          expect(screen.getByText("Source files")).toBeInTheDocument();
        });
      });
    });
  

  });

})