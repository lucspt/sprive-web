import { Modal } from "../../../components/modals/Modal";
import { expect, describe, it } from "vitest";
import { renderWithRouter } from "../../utils";
import { screen } from "@testing-library/react";


const _render = (children, props) => {
  return renderWithRouter(
    <Modal visible={true} {...props}>
      {children}
    </Modal>,
    "/"
  );
};

describe("Modal", () => {

  it("Children are rendered when visible prop is true", () => {
    const text = "I am visible"
    _render(text, {visible: true})

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("Is not visible when visible prop is false", () => {
    const text = "lovinglife"
    _render(text, {visible: false})
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  });

  it("Renders a close button when showClose prop is true", () => {
    _render("", {showClose: true})

    expect(screen.getByText("close")).toBeInTheDocument();
  });

  it("Renders the title text when the prop is passed", () => {
    const titleText = "here"
    _render("", {titleText})
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it("Adds a 'small' class to the container when small prop is true", async () => {
   const { container } = _render("", {small: true});
    expect(container.getElementsByClassName("small").length).toBeTruthy();
  });


})