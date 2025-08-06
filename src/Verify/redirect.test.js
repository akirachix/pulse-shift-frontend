import React from "react";
import { render } from "@testing-library/react";
import Verify from "./index";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({ state: {} }), 
}));

test("redirects to /forgot-password if no email in location state", () => {
  render(
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Verify />
    </MemoryRouter>
  );
  expect(mockedNavigate).toHaveBeenCalledWith("/forgot-password");
});
