import { requestPasswordReset, resetPassword } from './passwordReset'; 


describe('passwordReset utility functions', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('requestPasswordReset success', async () => {
    const mockResponse = { message: 'OTP sent' };
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
    );

    const data = await requestPasswordReset('test@example.com');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/reset-request/'), expect.any(Object));
    expect(data).toEqual(mockResponse);
  });

  test('requestPasswordReset failure with detail', async () => {
    const errorDetail = 'Invalid email';
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ detail: errorDetail }) })
    );

    await expect(requestPasswordReset('bad@example.com')).rejects.toThrow(errorDetail);
  });

  test('requestPasswordReset failure without detail', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.reject(new Error('bad json')) })
    );

    await expect(requestPasswordReset('bad2@example.com')).rejects.toThrow('Error sending reset email');
  });

  test('resetPassword success', async () => {
    const mockResponse = { message: 'Password reset successful' };
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
    );

    const data = await resetPassword('test@example.com', '123456', 'newpass123');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/reset-password/'), expect.any(Object));
    expect(data).toEqual(mockResponse);
  });

  test('resetPassword failure with detail', async () => {
    const errorDetail = 'OTP expired';
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ detail: errorDetail }) })
    );

    await expect(resetPassword('test@example.com', '000000', 'failpass')).rejects.toThrow(errorDetail);
  });

  test('resetPassword failure without detail', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.reject(new Error('bad json')) })
    );

    await expect(resetPassword('test@example.com', '0001', 'somepass')).rejects.toThrow('Password reset failed');
  });
});
