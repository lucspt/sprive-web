import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor,  } from "@testing-library/react";
import { canvasTestingBeforeEach, renderWithRouter, setupEmptyDataHandler } from "../../../utils";
import { Overview } from "../../../../components/saviors/overview/Overview";
import { SaviorContext } from "../../../../contexts/savior/SaviorContext";
import { mockCompanyAccount } from "../../../msw/mock-data";
import { overviewLoader } from "../../../../components/saviors/overview/loader";
import * as commonHooks from "../../../../hooks/common/useIsElementInViewport";
import { mockIntersectionObserver } from "./mock";

const _render = () => {
  return renderWithRouter(
    <SaviorContext.Provider value={{ savior: mockCompanyAccount }}>
      <Overview />
    </SaviorContext.Provider>,
    "/saviors/overview",
    { loader: overviewLoader }
  )
}
describe("Overview", () => {
  it("Renders header", async () => {
    setupEmptyDataHandler("saviors/logs");
    _render();
    await waitFor(() => expect(screen.getByText("Overview")).toBeInTheDocument());
  });


  describe("When logs are empty", () => {
    beforeEach(() => {
      setupEmptyDataHandler("saviors/logs");
      _render()
    });

    it("Renders measurement CTA", async () => {

      await waitFor(() => {
          [/No data/, "Measure"].map(txt => {
          expect(screen.getByText(txt)).toBeInTheDocument();
        });
    });

    });
  });

  describe("When logs are present",  () => {
    const useIsElementInViewportSpy = vi.spyOn(commonHooks, "useIsElementInViewport");
    mockIntersectionObserver();
    beforeEach(() => {
      canvasTestingBeforeEach(global);
      _render();
    });
    
    describe("EmissionsByYearBar", () => {
      
      it("Renders", async () => {
        await waitFor(() => {
          expect(screen.getByTestId("yearly-emissions-stacked-bar")).toBeInTheDocument();
        });
      });
      
      it("Renders the legend", async () => {
        await waitFor(() => {
          expect(screen.getByTestId("yearly-bar-legend")).toBeInTheDocument();
        })
      })
      
    });

    describe("Bottom Charts", () => {

      
      it("Renders bottom charts when in viewport", async () => {
        // IntersectionObserver isn't available in test environment
        useIsElementInViewportSpy.mockReturnValue(true);
        await waitFor(() => {
          ["category-bar", "subcategories-doughnut"].map(id => {
            expect(screen.getByTestId(id)).toBeInTheDocument();
          });
          
        })
      })

      test("A header displays the partner's biggest emitters", async () => {
        await waitFor(() => {
          expect(screen.getByText("your biggest emitter", { exact: false })).toBeInTheDocument();
        });
      })
    });
      
  });

})