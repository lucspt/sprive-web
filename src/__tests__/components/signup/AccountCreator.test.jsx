import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../../utils";
import { AccountCreator } from "../../../components/signup/AccountCreator";
import { describe, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { mockSuccessEmail, mockTakenEmail, setupHandlers } from "./msw";

const testInputRenderAndFunctionality = async (labelText, testVal, testingInvalidValue=false) => {
  const input = screen.getByLabelText(labelText);
  console.log(testVal, "TESTVAL ");
  await act(async () => {
    await userEvent.type(input, testVal);
  });

  console.log("expecting now")
  expect(input).toHaveValue(testVal);
  
  act(() => {
    fireEvent.click(screen.getByText("Continue"));
  });
  
  await waitFor(() => {
    if (testingInvalidValue) {
      expect(screen.getByTestId("input-error")).toBeInTheDocument();
    } else {
      expect(screen.queryByTestId("input-error")).not.toBeInTheDocument();
    };
  });
};


function _render() { renderWithRouter(<AccountCreator />, "/signup"); };

describe("AccountCreator", () => {

  beforeEach(() => setupHandlers());
  it("Multi-step works with valid input values", async () => {
    _render();
    await testInputRenderAndFunctionality(/Enter your company email/, mockSuccessEmail);

    // TODO: this is throwing an error and types in "Sprive" like 20 times in the same input
    await testInputRenderAndFunctionality(
      /Enter your company name/,
      "Sprive"
    );
      
      
    await testInputRenderAndFunctionality(
      /Choose a password/,
      "LIFEISBEAUTIFUL"
    );
  });
  it("Throws error when receiving an email that's already being used", async () => {
    _render();
    
    await testInputRenderAndFunctionality(
      "Enter your company email",
      mockTakenEmail,
      true,
    );
  });
});