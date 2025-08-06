import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./index";

describe("Modal component", () => {
  test("renders children when open", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Test Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Should not be visible</div>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  test("calls onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();

    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole("button");

    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("clicking outside modal content calls onClose", () => {
    const onCloseMock = jest.fn();

    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

    const overlay = screen.getByText("Modal Content").parentElement.parentElement;

    fireEvent.click(overlay);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("clicking inside modal content does NOT call onClose", () => {
    const onCloseMock = jest.fn();

    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

    const content = screen.getByText("Modal Content").parentElement;

    fireEvent.click(content);

    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
