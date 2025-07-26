/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from ".";
import { useOrders } from "../hooks/useFetchOrders";
import { useOrdersDetails } from "../hooks/useFetchOrderDetails";
import { usePayments } from "../hooks/usePayments";
import { useMamambogas } from "../hooks/useMamaMboga";
import { useCustomers } from "../hooks/useCustomers";


jest.mock("../hooks/useFetchOrders", () => ({
    useOrders: jest.fn(),
}));
jest.mock("../hooks/useFetchOrderDetails", () => ({
    useOrdersDetails: jest.fn(),
}));
jest.mock("../hooks/usePayments", () => ({
    usePayments: jest.fn(),
}));
jest.mock("../hooks/useCustomers", () => ({
    useCustomers: jest.fn(),
}));
jest.mock("../hooks/useMamaMboga", () => ({
    useMamambogas: jest.fn(),
}));

jest.mock("../utils/filterUtils", () => ({
    filterByDay: jest.fn((orders, date) => orders),
    filterByWeek: jest.fn((orders) => orders),
    filterByMonth: jest.fn((orders) => orders),
    filterByDateRange: jest.fn((orders, start, end) => orders),
}));
jest.mock("../utils/computeUtils", () => ({
    computeCustomerInsights: jest.fn(() => [
        { name: "Returning", value: 1 },
        { name: "New", value: 1 },
    ]),
    computeGrossSales: jest.fn((payments) =>
        payments.reduce((sum, p) => sum + p.amount, 0)
    ),
    computeOrdersOverTime: jest.fn((orders) => [
        { date: "2025-07-23", orders: 1 },
        { date: "2025-07-24", orders: 1 },
    ]),
    computeOrderStatusData: jest.fn((orders) => [
        { name: "Processing", value: 1 },
        { name: "Delivered", value: 1 },
    ]),
    computeTopVendors: jest.fn((orderItems, mamambogas) => [
        { name: "Vendor A", sales: 1 },
        { name: "Vendor B", sales: 1 },
    ]),
}));

jest.mock("./components/DashboardFilter", () => (props) => (
    <div data-testid="dashboard-filter">
        <button data-testid="filter-week" onClick={() => props.setFilterType("week")}>Week</button>
        <button data-testid="filter-month" onClick={() => props.setFilterType("month")}>Month</button>
        <button data-testid="filter-day" onClick={() => props.setFilterType("day")}>Day</button>
        <button data-testid="filter-dateRange" onClick={() => props.setFilterType("dateRange")}>Range</button>
    </div>
));
jest.mock("./components/Profile", () => () => <div data-testid="user-profile">Profile</div>);
jest.mock("./components/DashboardCards", () => ({ summary }) => (
    <div data-testid="dashboard-cards">{summary.map((s) => <span key={s.title}>{s.title}:{s.value}</span>)}</div>
));
jest.mock("./components/TopVendorsChart", () => ({ data }) => (
    <div data-testid="top-vendors-chart">{data.map((v) => <span key={v.name}>{v.name}</span>)}</div>
));
jest.mock("./components/OrderStatusPieChart", () => ({ data }) => (
    <div data-testid="order-status-pie-chart">{data.map((o) => <span key={o.name}>{o.name}</span>)}</div>
));
jest.mock("./components/CustomerInsightsPieChart", () => ({ data }) => (
    <div data-testid="customer-insights-pie-chart">{data.map((c) => <span key={c.name}>{c.name}</span>)}</div>
));
jest.mock("./components/RecentOrdersTable", () => ({ orders, customerMap }) => (
    <div data-testid="recent-orders-table">
        {orders.map((o) => (
            <div key={o.order_id}>{customerMap[o.customer]} - {o.current_status}</div>
        ))}
    </div>
));
jest.mock("./components/OrdersOverTimeChart", () => ({ data }) => (
    <div data-testid="orders-over-time-chart">
        {data.map((d) => <span key={d.date}>{d.date}:{d.orders}</span>)}
    </div>
));

describe("AdminDashboard", () => {
    beforeEach(() => {
        useOrders.mockImplementation(() => ({
            orders: [
                { order_id: "o1", order_date: "2025-07-24", customer: "c1", current_status: "Processing", payment_status: "Paid", total_amount: "1000" },
                { order_id: "o2", order_date: "2025-07-23", customer: "c2", current_status: "Delivered", payment_status: "Paid", total_amount: "2300" }
            ],
            loading: false,
            error: null
        }));
        useOrdersDetails.mockImplementation(() => ({
            orders_items: [
                { order: "o1", vendor: "v1", item: "Item A" },
                { order: "o2", vendor: "v2", item: "Item B" }
            ],
            loading: false,
            error: null
        }));
        usePayments.mockImplementation(() => ({
            payments: [
                { order: "o1", amount: 1000 },
                { order: "o2", amount: 2300 }
            ],
            loading: false,
            error: null
        }));
        useCustomers.mockImplementation(() => ({
            customers: [
                { id: "c1", first_name: "Alice", email: "alice@example.com" },
                { id: "c2", first_name: "Bob", email: "bob@example.com" }
            ],
            loading: false,
            error: null
        }));
        useMamambogas.mockImplementation(() => ({
            mamambogas: [
                { id: "v1", name: "Vendor A" },
                { id: "v2", name: "Vendor B" }
            ],
            loading: false,
            error: null
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders dashboard header, profile, and filter", () => {
        render(<AdminDashboard />);
        expect(screen.getByTestId("user-profile")).toBeInTheDocument();
        expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
        expect(screen.getByTestId("dashboard-filter")).toBeInTheDocument();
    });

    it("renders summary cards with correct values", () => {
        render(<AdminDashboard />);
        expect(screen.getByTestId("dashboard-cards")).toHaveTextContent("Vendors:2");
        expect(screen.getByTestId("dashboard-cards")).toHaveTextContent("Customers:2");
        expect(screen.getByTestId("dashboard-cards")).toHaveTextContent("Orders:2");
        expect(screen.getByTestId("dashboard-cards")).toHaveTextContent("Gross Sales:3300");
    });

    it("renders all chart components", () => {
        render(<AdminDashboard />);
        expect(screen.getByTestId("orders-over-time-chart")).toBeInTheDocument();
        expect(screen.getByTestId("top-vendors-chart")).toBeInTheDocument();
        expect(screen.getByTestId("order-status-pie-chart")).toBeInTheDocument();
        expect(screen.getByTestId("customer-insights-pie-chart")).toBeInTheDocument();
    });

    it("renders recent orders table with customer names and status", () => {
        render(<AdminDashboard />);
        expect(screen.getByTestId("recent-orders-table")).toHaveTextContent("Alice - Processing");
        expect(screen.getByTestId("recent-orders-table")).toHaveTextContent("Bob - Delivered");
    });

    it("filters recent orders by search input", async () => {
        render(<AdminDashboard />);
        const searchInput = screen.getByPlaceholderText("Search by customer or status");
        fireEvent.change(searchInput, { target: { value: "Delivered" } });
        await waitFor(() => {
            expect(screen.getByTestId("recent-orders-table")).toHaveTextContent("Bob - Delivered");
            expect(screen.getByTestId("recent-orders-table")).not.toHaveTextContent("Alice - Processing");
        });
        fireEvent.change(searchInput, { target: { value: "Alice" } });
        await waitFor(() => {
            expect(screen.getByTestId("recent-orders-table")).toHaveTextContent("Alice - Processing");
            expect(screen.getByTestId("recent-orders-table")).not.toHaveTextContent("Bob - Delivered");
        });
    });

    it("changes filter type when filter buttons are clicked", () => {
        render(<AdminDashboard />);
        fireEvent.click(screen.getByTestId("filter-month"));
        const { filterByMonth } = require("../utils/filterUtils");
        expect(filterByMonth).toHaveBeenCalled();
    });

    it("shows error if any hook returns an error", () => {
        useOrders.mockImplementationOnce(() => ({
            orders: [],
            loading: false,
            error: "Failed to fetch orders"
        }));
        render(<AdminDashboard />);
        expect(screen.getByText("Failed to fetch orders")).toBeInTheDocument();
    });

    it("shows loading overlay when loading", () => {
        useOrders.mockImplementationOnce(() => ({
            orders: [],
            loading: true,
            error: null
        }));
        render(<AdminDashboard />);
        expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
    });

    it("shows filter error if customDate filter is missing date", () => {
        render(<AdminDashboard />);
        fireEvent.click(screen.getByTestId("filter-day"));
        expect(screen.getByText("Please select a date.")).toBeInTheDocument();
    });

    it("shows filter error if dateRange filter is missing dates", () => {
        render(<AdminDashboard />);
        fireEvent.click(screen.getByTestId("filter-dateRange"));
        expect(screen.getByText("Please select a valid date range.")).toBeInTheDocument();
    });
});