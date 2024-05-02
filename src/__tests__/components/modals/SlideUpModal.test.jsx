import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SlideUpModal } from "../../../components/modals/SlideUpModal";


describe("SlideUpModalWrapper", () => {

  it("Renders content when visible prop is true", () => {
    const text = "here";
    render(
      <SlideUpModal visible={true}>
        <div>{ text }</div>
      </SlideUpModal>
    )
    expect(screen.getByText(text)).toBeInTheDocument();
  })

  it("Does not render when visible prop is false", () => {
    const text = "not here"
    render(
      <SlideUpModal visible={false}>
        { text }
      </SlideUpModal>
    );
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  });

});