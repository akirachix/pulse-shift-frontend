import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Verify from "./index";
import { MemoryRouter } from "react-router-dom";

test("arrow keys navigate inputs", () => {
  render(
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Verify />
    </MemoryRouter>
  );

  const inputs = [
    screen.getByLabelText("OTP digit 1"),
    screen.getByLabelText("OTP digit 2"),
    screen.getByLabelText("OTP digit 3"),
    screen.getByLabelText("OTP digit 4"),
  ];

  act(() => {
    inputs[1].focus();
  });
  expect(document.activeElement).toBe(inputs[1]);

  fireEvent.keyDown(inputs[1], { key: "ArrowLeft" });
 
  expect(document.activeElement).toBe(inputs[1]);

  fireEvent.keyDown(inputs[0], { key: "ArrowLeft" });
  expect(document.activeElement).toBe(inputs[1]);

  fireEvent.keyDown(inputs[0], { key: "ArrowRight" });
  expect(document.activeElement).toBe(inputs[1]);

  act(() => {
    inputs[3].focus();
  });
  expect(document.activeElement).toBe(inputs[3]);

  fireEvent.keyDown(inputs[3], { key: "ArrowRight" });
  expect(document.activeElement).toBe(inputs[3]);
});
