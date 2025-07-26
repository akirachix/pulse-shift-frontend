
import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardLayout from './index';                                 



jest.mock("../Sidebar", () => ({
    __esModule: true,
    Sidebar: () => <nav data-testid="sidebar">Sidebar</nav>,
}));

jest.mock("react-router-dom", () => ({
    __esModule: true,
    ...jest.requireActual("react-router-dom"),
    Outlet: () => <div data-testid="outlet">Outlet content</div>,
}));

describe("DashboardLayout", () => {
    test("renders the Sidebar", () => {
        render(<DashboardLayout />);
        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(screen.getByText(/sidebar/i)).toBeInTheDocument();
    });

    test("renders the Outlet content", () => {
        render(<DashboardLayout />);
        expect(screen.getByTestId("outlet")).toBeInTheDocument();
        expect(screen.getByText(/outlet content/i)).toBeInTheDocument();
    });

    test("applies correct class names", () => {
        render(<DashboardLayout />);
        expect(document.querySelector(".dashboard-layout")).toBeInTheDocument();
        expect(document.querySelector(".main-content")).toBeInTheDocument();
    });
});
