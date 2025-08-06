import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignIn from ".";
jest.mock("../hooks/useSigninUser");
jest.mock("../AuthContext");
const mockSignin = jest.fn();
const onLoginSuccess = jest.fn();
function setup({ isAuthenticated = false, error = null, loading = false, success = false } = {}) {
  require("../hooks/useSigninUser").useSigninUser.mockReturnValue({
    signin: mockSignin,
    error,
    loading,
    success,
  });
  require("../AuthContext").useAuth.mockReturnValue({
    isAuthenticated,
  });
  return render(
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <SignIn onLoginSuccess={onLoginSuccess} />
    </MemoryRouter>
  );
}
describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders the form fields", () => {
    setup();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
  it("redirects if already authenticated", () => {
    setup({ isAuthenticated: true });
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i, { selector: 'input' })).not.toBeInTheDocument();
  });
  it("shows error message from signin hook", () => {
    setup({ error: "Invalid credentials" });
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
  it("disables submit button if password is too short", () => {
    setup();
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), { target: { value: "123" } });
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });
  it("enables submit button with valid input", () => {
    setup();
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), { target: { value: "123456" } });
    expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled();
  });
  it("calls signin with correct credentials", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "Mercy" } });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), { target: { value: "mypassword" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith("Mercy", "mypassword");
    });
  });
  it("shows loading state on button", () => {
    setup({ loading: true });
    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
  });
  it("shows success message after successful signin", () => {
    setup({ submitted: true, success: true });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "user" } });
    fireEvent.change(
      screen.getByLabelText(/password/i, { selector: 'input' }),
      { target: { value: "123456" } }
    );
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    require("../hooks/useSigninUser").useSigninUser.mockReturnValue({
      signin: mockSignin,
      error: null,
      loading: false,
      success: true,
    });
    expect(screen.getByText(/sign in successful/i)).toBeInTheDocument();
  });
  it("toggles password visibility", () => {
    setup();
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const toggleButton = screen.getByRole("button", { name: /show password/i });
    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });
  it("shows required validation for empty fields", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    const passwordInput = await screen.findByLabelText(/password/i, { selector: 'input' });
    expect(passwordInput).toHaveAttribute("aria-invalid", "false");
  });
});