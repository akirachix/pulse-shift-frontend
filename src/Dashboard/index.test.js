import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from ".";

jest.mock("./components/DashboardCards", () => ({
    __esModule: true,
    default: ({ summary }) => (
        <div data-testid="dashboard-cards">
            {summary.map((card) => (
                <div key={card.title}>{card.title}: {card.value}</div>
            ))}
        </div>
    ),
}));

jest.mock("./components/TopVendorsChart", () => ({
    __esModule: true,
    TopVendorsChart: ({ data }) => (
        <div data-testid="top-vendors-chart">
            {data.map((vendor) => <span key={vendor.name}>{vendor.name}</span>)}
        </div>
    ),
}));
jest.mock("./components/OrderStatusPieChart", () => ({
    __esModule: true,
    OrderStatusPieChart: ({ data }) => (
        <div data-testid="order-status-pie-chart">
            {data.map((status) => <span key={status.name}>{status.name}</span>)}
        </div>
    ),
}));
jest.mock("./components/CustomerInsightsPieChart", () => ({
    __esModule: true,
    CustomerInsightsPieChart: ({ data }) => (
        <div data-testid="customer-insights-pie-chart">
            {data.map((insight) => <span key={insight.name}>{insight.name}</span>)}
        </div>
    ),
}));
jest.mock("./components/OrdersOverTimeChart", () => ({
    __esModule: true,
    OrdersOverTimeChart: ({ data }) => (
        <div data-testid="orders-over-time-chart">
            {data.map((d) => <span key={d.date}>{d.date}:{d.orders}</span>)}
        </div>
    ),
}));
describe("AdminDashboard", () => {
    it("renders all admin dashboard sections", () => {
        render(
            <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}  >
                <AdminDashboard />
            </MemoryRouter>
        );

        expect(screen.getByTestId("dashboard-cards")).toBeInTheDocument();
        expect(screen.getByTestId("top-vendors-chart")).toBeInTheDocument();
        expect(screen.getByTestId("order-status-pie-chart")).toBeInTheDocument();
        expect(screen.getByTestId("customer-insights-pie-chart")).toBeInTheDocument();
        expect(screen.getByTestId("orders-over-time-chart")).toBeInTheDocument();
    });
});