import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResetNotification from "./index";
import { MemoryRouter } from "react-router-dom";


const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ResetNotification Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("renders congratulations message and button", () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ResetNotification />
      </MemoryRouter>
    );

    expect(screen.getByText(/Congratulations/i)).toBeInTheDocument();
    expect(screen.getByText(/Your account has been/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  test("navigates to /sign-in on button click", () => {
    render(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ResetNotification />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith("/sign-in");
  });
});
