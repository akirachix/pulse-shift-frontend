import React from "react";
import { render, act } from "@testing-library/react";
import { usePasswordReset } from "./usePasswordReset"; 
import * as passwordResetUtils from "../utils/passwordReset"; 

function HookTest({ callback }) {
  callback();
  return null;
}

describe("usePasswordReset hook", () => {
  let hook;

  function renderHook() {
    render(<HookTest callback={() => { hook = usePasswordReset(); }} />);
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("has initial loading and error state", () => {
    renderHook();
    expect(hook.loading).toBe(false);
    expect(hook.error).toBe(null);
  });

  test("sendResetRequest succeeds and updates state", async () => {
    jest.spyOn(passwordResetUtils, "requestPasswordReset").mockResolvedValue({ success: true });

    renderHook();

    let data;
    await act(async () => {
      data = await hook.sendResetRequest("test@example.com");
    });

    expect(data).toEqual({ success: true });
    expect(hook.loading).toBe(false);
    expect(hook.error).toBe(null);
  });

  test("sendResetRequest fails and sets error", async () => {
    const errorMsg = "Network error";
    jest.spyOn(passwordResetUtils, "requestPasswordReset").mockRejectedValue(new Error(errorMsg));

    renderHook();

    await act(async () => {
      await expect(hook.sendResetRequest("fail@example.com")).rejects.toThrow(errorMsg);
    });

    expect(hook.loading).toBe(false);
    expect(hook.error).toBe(errorMsg);
  });

  test("submitResetPassword succeeds and updates state", async () => {
    jest.spyOn(passwordResetUtils, "resetPassword").mockResolvedValue({ reset: true });

    renderHook();

    const params = { email: "test@example.com", otp: "1234", password: "pass123" };
    let data;
    await act(async () => {
      data = await hook.submitResetPassword(params);
    });

    expect(data).toEqual({ reset: true });
    expect(hook.loading).toBe(false);
    expect(hook.error).toBe(null);
  });

  test("submitResetPassword fails and sets error", async () => {
    const errorMsg = "Reset failed";
    jest.spyOn(passwordResetUtils, "resetPassword").mockRejectedValue(new Error(errorMsg));

    renderHook();

    const params = { email: "fail@example.com", otp: "0000", password: "badPass" };
    await act(async () => {
      await expect(hook.submitResetPassword(params)).rejects.toThrow(errorMsg);
    });

    expect(hook.loading).toBe(false);
    expect(hook.error).toBe(errorMsg);
  });
});
