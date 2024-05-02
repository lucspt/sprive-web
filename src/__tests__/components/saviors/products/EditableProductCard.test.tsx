import { describe, expect, test } from "vitest";
import { renderWithRouter } from "../../../utils";
import { EditableProductCard } from "../../../../components/saviors/products/editor/EditableProductCard";
import { editProcess, loadProductForPartner } from "../../../../components/saviors/products/editor/route-utils";
import { mockObjectId, mockProduct } from "../../../msw/mock-data";
import { act, fireEvent, getByTestId, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupEditProcessHandler } from "./msw";

const _render = () => {
  renderWithRouter(
    <EditableProductCard />,
    "/products/:productId",
    { loader: loadProductForPartner, action: editProcess },
    [],
    `/products/${mockObjectId}`,
  )
};

const goToProcessEditor = () => {
  const stage = mockProduct.stages[0]
  const stageDropdown = screen.getByText(stage.stage);
  
  act(() => fireEvent.click(stageDropdown));
  const process = stage.processes[0].process;
  const processEl = screen.getByText(process)
  const editbtn = getByTestId(processEl.nextSibling as HTMLElement, "edit-process-btn")
  act(() => fireEvent.click(editbtn));
};

describe("EditableProductCard", () => {

  test("A footer renders with publish and edit options", async () => {
    _render();
    await waitFor(() => {
      ["publish", "edit"].map(x => expect(screen.getByText(x, { exact: false })).toBeInTheDocument());
    });
  });

  describe("Process editing", () => {

    test("A process is editable", async () => {
      _render();
      await waitFor(() => {
        goToProcessEditor();
        expect(screen.getByTestId("process-editor")).toBeInTheDocument();
      });
    });

    const _renderSaveBtn = async () => {
        _render();
        await waitFor(async () => {
          goToProcessEditor();
          const label = screen.getByText("Value", { exact: false });
          const input = label.parentElement?.lastChild;
          await userEvent.type(input as HTMLInputElement, "10");
          expect(screen.getByText("Save", { exact: false })).toBeInTheDocument();
        })
    }

    test("Changing an input renders a save button", async () => {
      await _renderSaveBtn();
    });

    test("Clicking save button renders product again", async () => {
      setupEditProcessHandler();
      await _renderSaveBtn();
      act(() => {
        fireEvent.click(screen.getByText("Save", { exact: false }));
      });

      await waitFor(() => {
        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      });

    });

  });

});