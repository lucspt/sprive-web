import { renderWithRouter } from "../../utils";
import { Account } from "../../../components/saviors/account/Account";
import { accountActions } from "../../../components/saviors/account/action";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect } from "vitest";
import { SaviorContext } from "../../../contexts/savior/SaviorContext";
import { mockCompanyAccount, mockUserAccount } from "../../msw/mock-data";

const TEXT_MATCHES = [/Profile/, "Bio", "Email"];

const _render = (ctxValues, action) => {
  renderWithRouter(
    <SaviorContext.Provider value={ctxValues}>
      <Account />
    </SaviorContext.Provider>,
    "/saviors/account",
    {action},
  );
};

describe("Account", () => {

  it("Renders a Profile card", async () => {
    _render({ savior: mockUserAccount });
    await waitFor(() => {
      TEXT_MATCHES.map(txt => {
        expect(screen.getByText(txt)).toBeInTheDocument();
      });
    });
  });

  describe("Company Tree", () => {
    it("Doesn't render when role is user", async () => {
      _render({ savior: mockUserAccount });
      await waitFor(() => {
        expect(screen.queryByText(/Company users/)).not.toBeInTheDocument();
      });
    });

    it("Renders and functions when role is equal to company", async () => {
        _render({ savior: mockCompanyAccount });
        await waitFor(() => {
          expect(screen.getByText(/Company users/)).toBeInTheDocument();
        });
    });

    it("Can POST users to company tree", async () => {
        _render({ savior: mockCompanyAccount }, accountActions);
        const fillInput = async (labelText, inputVal) => {
          const input = screen.getByLabelText(labelText)
          await userEvent.type(input, inputVal);
        };

        await waitFor(async () => {
          const addUsersBtn = screen.getByText(/Add users/);
          fireEvent.click(addUsersBtn);
          expect(screen.getByText(/Invite user/)).toBeInTheDocument();
        })
        await waitFor(() => fillInput(/Enter email/, "random@sprive.com"));
        await waitFor(() => fillInput(/name/, "Random"));
        await waitFor(() => fillInput(/password/, "Passw"));
        await waitFor(async () => {
          const choosePermsBtn = screen.getByText(/permissions/);
          act(() => fireEvent.click(choosePermsBtn));

          const userPerms = screen.getByTestId(/dropdown-picker-button-user/);
          act(() => fireEvent.click(userPerms));
        });

        const getNumUsersRendered = () => screen.getByTestId("company-users").childElementCount;
        const numUsersBeforeInvite = getNumUsersRendered();
        const inviteBtn = screen.getByText(/Invite user/)
        act(() => fireEvent.click(inviteBtn));
        await waitFor(() => {
          expect(getNumUsersRendered()).toBeGreaterThan(numUsersBeforeInvite);
        });
    })
  });

});


 