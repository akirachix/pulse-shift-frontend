import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignIn from "./index";
import { useUserSignin } from "../hooks/userSignin";

jest.mock("../hooks/userSignin");

describe("SignIn Component", () => {
  const mockSignin = jest.fn();
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    useUserSignin.mockReturnValue({
      signin: mockSignin,
      error: null,
      loading: false,
      success: false,
    });

    render(
      <MemoryRouter>
        <SignIn onLoginSuccess={mockOnLoginSuccess} />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders username and password inputs, buttons, links, and texts", () => {
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i, { selector: "input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Do not have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /SIGN UP/i })).toBeInTheDocument();
  });

  test("allows user to type username and password", async () => {
    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: "input" });

    await user.clear(usernameInput);
    await user.type(usernameInput, "testuser");
    expect(usernameInput).toHaveValue("testuser");

    await user.clear(passwordInput);
    await user.type(passwordInput, "mypassword");
    expect(passwordInput).toHaveValue("mypassword");
  });

  test("toggles password visibility when toggle button is clicked", async () => {
    const user = userEvent.setup();
    const passwordInput = screen.getByLabelText(/Password/i, { selector: "input" });
    const toggleButton = screen.getByRole("button", {
      name: /Show password|Hide password/i,
    });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("submits form and shows success message", async () => {
    const user = userEvent.setup();

    useUserSignin.mockReturnValue({
      signin: mockSignin.mockResolvedValueOnce({ token: "mock-token" }),
      error: null,
      loading: false,
      success: true,
    });

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: "input" });
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    await user.clear(usernameInput);
    await user.type(usernameInput, "testuser");

    await user.clear(passwordInput);
    await user.type(passwordInput, "mypassword");

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith("testuser", "mypassword");
      expect(screen.getByText(/Sign in successful!/i)).toBeInTheDocument();
    });
  });

  test("checkbox is present and can be checked and unchecked", async () => {
    const user = userEvent.setup();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});