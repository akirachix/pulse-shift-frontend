
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./index";


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../hooks/fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useFetchUserData from "../hooks/fetch";

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading when fetching data", () => {
    useFetchUserData.mockReturnValue({
      users: [],
      loading: true,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("renders error and redirects to signin when no token", () => {
    useFetchUserData.mockReturnValue({
      users: [],
      loading: false,
      error: "No authentication token found",
    });
    render(<Dashboard />);
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  test("renders user data table and modal open/close", () => {
    useFetchUserData.mockReturnValue({
      users: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          phone_number: "123456",
          user_type: "customer",
          is_active: true,
          registration_date: "2023-01-01T00:00:00Z",
          email: "john@example.com",
        },
      ],
      loading: false,
      error: null,
    });
    render(<Dashboard />);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/View/i));
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("×"));
    expect(screen.queryByText(/Email:/i)).not.toBeInTheDocument();
  });

  test("search bar filters users by name and phone", () => {
    useFetchUserData.mockReturnValue({
      users: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          phone_number: "123456",
          user_type: "customer",
          is_active: true,
          registration_date: "2023-01-01T00:00:00Z",
          email: "john@example.com",
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          phone_number: "654321",
          user_type: "customer",
          is_active: true,
          registration_date: "2023-02-01T00:00:00Z",
          email: "jane@example.com",
        },
      ],
      loading: false,
      error: null,
    });
    render(<Dashboard />);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Search by Name or Number/i), {
      target: { value: "Jane" },
    });
    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Search by Name or Number/i), {
      target: { value: "123456" },
    });

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
  });
});
