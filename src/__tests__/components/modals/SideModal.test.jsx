import { screen, render } from "@testing-library/react";
import { describe, expect } from "vitest";
import { SideModal } from "../../../components/modals/SideModal";
describe("SideModal", () => {

  it("Renders when visible prop is true", () => {
    const text = "visible";
    render(
      <SideModal visible={true}>
        { text }
      </SideModal>
    )
    expect(screen.getByText(text)).toBeInTheDocument();
  })

  it("Does not render when visible prop is false", () => {
    const text = "not visible"
    render(
      <SideModal visible={false}>
        { text }
      </SideModal>
    )
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  });
  
})