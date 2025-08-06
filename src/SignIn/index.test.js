import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignIn from "./index";
import { useSigninUser } from "../hooks/useSigninUser";

jest.mock("../hooks/useSigninUser");

describe("SignIn Component", () => {
  const mockSignin = jest.fn();
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    useSigninUser.mockReturnValue({
      signin: mockSignin,
      error: null,
      loading: false,
      success: false,
    });

    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
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

    useSigninUser.mockReturnValue({
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
  test("disables submit button and shows loading text when loading is true", () => {
    useSigninUser.mockReturnValue({
      signin: mockSignin,
      error: null,
      loading: true,
      success: false,
    });

    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <SignIn onLoginSuccess={mockOnLoginSuccess} />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: /Signing In.../i });
    expect(submitButton).toBeDisabled();
  });

  test("displays error message when error exists", () => {
    useSigninUser.mockReturnValue({
      signin: mockSignin,
      error: "Invalid credentials",
      loading: false,
      success: false,
    });

    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <SignIn onLoginSuccess={mockOnLoginSuccess} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  test("input fields have correct maxLength attributes", () => {
    expect(screen.getByLabelText(/Username/i)).toHaveAttribute("maxLength", "254");
    expect(screen.getByLabelText(/Password/i, { selector: "input" })).toHaveAttribute("maxLength", "32");
  });
});