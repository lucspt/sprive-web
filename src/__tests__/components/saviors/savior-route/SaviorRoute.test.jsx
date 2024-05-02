import { renderWithRouter } from "../../../utils";
import { beforeEach, expect, describe, it, vi } from "vitest";
import { SaviorContext } from "../../../../contexts/savior/SaviorContext";
import { SaviorRoute } from "../../../../components/saviors/route/SaviorRoute";
import { screen, waitFor } from "@testing-library/react";
import { mockUserAccount } from "../../../msw/mock-data";
import * as utils from "../../../../utils/utils";
import { act } from "react-dom/test-utils";
import { setupHandlers } from "./msw";
import { Fragment } from "react/jsx-runtime";

const _render = (ctxValues, extraRouteText, children) => {
  renderWithRouter(
    <SaviorContext.Provider value={ctxValues}>
      <SaviorRoute />
    </SaviorContext.Provider>,
    "/saviors",
    {},
    [{
      path: "/saviors/mock-route", element: <div>{ extraRouteText }</div>, 
      path: "/", element: <Fragment />
    }]
  );
};

describe("Savior Route", () => {
  const isLoggedInSpy = vi.spyOn(utils, "isLoggedIn")

  it("Will redirect to / when isLoggedIn returns false", async () => {
    isLoggedInSpy.mockReturnValueOnce(false)
    const textMatch = "should not render";
    _render({savior: mockUserAccount}, textMatch)

    await waitFor(() => {
      expect(screen.queryByText(textMatch)).not.toBeInTheDocument();
    });

  });
  
  it("Will render <Outlet /> component when isLoggedIn returns a csrf token", async () => {
    setupHandlers();
    isLoggedInSpy.mockReturnValueOnce("mocktoken");
    _render({ savior: mockUserAccount });
    await waitFor(() => {
        expect(screen.getByText("Overview")).toBeInTheDocument();
    });
  });

});