import { renderWithRouter } from "../../../utils";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileInput } from "../../../../components/inputs/file/FileInput";
import { userEvent } from "@testing-library/user-event"

const _render = (props) => {
  renderWithRouter(
    <FileInput {...props}/>,
    "/saviors/upload"
  );
}
describe("FileInput", () => {
  const requiredColumns = ["test1", "test2"]

  it("Renders a required columns notice", async () => {
    _render({requiredColumns});
    await waitFor(() => {
      requiredColumns.map(x => expect(screen.getByText(x)).toBeInTheDocument());
    });
    
  });

  const getInput = () => {
    const browseBtn = screen.getByText("Browse files", { exact: false });
    return browseBtn.querySelector("input");
  }
  it("Renders an input with correct `accept` attr", async () => {
    const fileTypes = ".csv";
    _render({requiredColumns, fileTypes, });
    await waitFor(() => {
      const input = getInput();
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("accept", fileTypes);
    });
  });

  it("Renders a submit button when prop is given", async () => {
    _render({requiredColumns, submitBtn: true})
    await waitFor(async () => {
      const getButtonDisabled = () => {
        const submitBtn = screen.getByText("Submit");
        return submitBtn.disabled;
      }
      expect(getButtonDisabled()).toBe(true);
      const input = getInput();
      const blob = new Blob([JSON.stringify({randomStuff: "lovelife"})]);
      await userEvent.upload(input, new File([blob], "mock-csv.csv"));
      await waitFor(() => {
        expect(getButtonDisabled()).toBe(false);
      });
    })
  })
})