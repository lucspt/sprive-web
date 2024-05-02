import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../utils";
import { Login } from "../../../components/login/Login";
import { describe, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { mockLoginCredentials, setupHandlers } from "./msw";

const TEXT_MATCH = "LOGGED IN";

const _render = () => {
  renderWithRouter(
    <Login redirectPath="/test-logged-in"/>, 
    "/login", 
    undefined,
    [{ path: "/test-logged-in", element: <div>{ TEXT_MATCH } </div>}]
  );

}
const renderAndLogin = async (email, password) =>     {
  _render();
  await act(async () => {
    await userEvent.type(screen.getByLabelText("Email"), email);
    await userEvent.type(screen.getByLabelText("Password"), password);
    fireEvent.click(screen.getByTestId("login-button"));
  });
}

describe("Login", () => {

  describe('Form works correctly', () => {
    beforeEach(() => setupHandlers())
    
    it("Inputs require values in order to submit", async () => {
      _render();
      await waitFor(() => {
        expect(screen.getByTestId("login-button")).toHaveAttribute("disabled");
      })
    });
    
    it("Works with valid credentials", async () => {
      await renderAndLogin(mockLoginCredentials.email, mockLoginCredentials.password);
      
      await waitFor(() => {
        expect(screen.queryByText("login-error")).not.toBeInTheDocument();
        expect(screen.getByText(TEXT_MATCH)).toBeInTheDocument();
      });
    });
    

    /** These tests are more server concerned, not frontend. Keeping them here for now though */
    // it("Fails with invalid email", async () => { 
    //   await renderAndLogin("randomemailtahtnooneuses@test-sprive.com", "lifebeautiful");
      
    //   await waitFor(() => {
    //     expect(screen.getByTestId("login-error")).toBeInTheDocument();
    //   })
    // });
    
    // it("Fails with valid email and invalid password", async () => {
    //   await renderAndLogin("luca@sprive.com", "invalidpassword");
    //   await waitFor(() => {
    //     expect(screen.getByTestId("login-error")).toBeInTheDocument();
    //   })
    // });
    
  });
    
})