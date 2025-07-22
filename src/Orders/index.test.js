import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Orders from "./";

jest.mock("../hooks/useFetchOrders", () => ({
  useFetchOrders: () => ({
    loading: false,
    error: null,
    orders: [
      {
        order_id: 1,
        customer: 101,
        current_status: "Completed",
        payment_status: "Paid",
        order_date: "2023-07-20T10:00:00Z"
      },
      {
        order_id: 2,
        customer: 102,
        current_status: "Pending",
        payment_status: "Unpaid",
        order_date: "2023-07-21T11:00:00Z"
      }
    ],
  }),
}));

jest.mock("../hooks/useFetchUsers", () => ({
  useFetchUsers: () => ({
    loading: false,
    error: null,
    users: [
      { id: 101, user_type: "customer", first_name: "John", last_name: "Doe" },
      { id: 102, user_type: "customer", first_name: "Jane", last_name: "Smith" },
      { id: 201, user_type: "mama_mboga", first_name: "Mama", last_name: "Mboga" },
    ],
  }),
}));

jest.mock("../hooks/useFetchOrderItems", () => ({
  useFetchOrderItems: () => ({
    loading: false,
    error: null,
    orderItems: [
      { order_item_id: 1001, order: 1, mama_mboga: 201, product: "prod1", quantity: "2", item_total: "200", price_per_unit_at_order: "100" },
      { order_item_id: 1002, order: 2, mama_mboga: 201, product: "prod2", quantity: "1", item_total: "50", price_per_unit_at_order: "50" },
    ],
  }),
}));

jest.mock("../OrderDetailsPopup", () => (props) => {
  return (
    <div data-testid="order-details-popup">
      <span>Order Details Popup for Order #{props.order.order_id}</span>
      <button onClick={props.onClose}>Close</button>
    </div>
  );
});

describe("Orders component", () => {
  it("renders orders table with correct data", () => {
    render(<Orders />);
    
    expect(screen.getByText("Mama Mboga Orders Overview")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Unpaid")).toBeInTheDocument();
  });

  it("filters orders based on search input", () => {
    render(<Orders />);
    const searchInput = screen.getByPlaceholderText(/Search by order ID or customer name/i);
    
    fireEvent.change(searchInput, { target: { value: "2" }});
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "john" }});
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("shows order details popup on clicking order row and closes it", () => {
    render(<Orders />);
    const firstOrderRow = screen.getByText("1").closest("tr");
    
    fireEvent.click(firstOrderRow);

    expect(screen.getByTestId("order-details-popup")).toBeInTheDocument();
    expect(screen.getByText(/Order Details Popup for Order #1/i)).toBeInTheDocument();


    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("order-details-popup")).not.toBeInTheDocument();
  });

  it("handles payment button click for unpaid orders", () => {
    window.alert = jest.fn();
    render(<Orders />);


    const unpaidButton = screen.getAllByText("Unpaid")[0];
    expect(unpaidButton).toBeInTheDocument();

    fireEvent.click(unpaidButton);
    expect(window.alert).toHaveBeenCalledWith("Payment details for Order ID: 2");
  });
});
