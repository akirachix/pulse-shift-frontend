import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrderDetailsPopup from "./index";

const productsMap = {
  1: { name: "Tomatoes" },
  2: { name: "Onions" }
};

const mockOrder = {
  order_id: 3,
  order_date: "2025-07-16T15:00:00Z",
  orderItems: [
    {
      order_item_id: 51,
      quantity: "4",
      price_per_unit_at_order: "128.00",
      item_total: "512.00",
      product: 1
    },
    {
      order_item_id: 52,
      quantity: "9",
      price_per_unit_at_order: "79.67",
      item_total: "713.99",
      product: 2
    }
  ],
  current_status: "Completed",
  payment_status: "Paid"
};

describe("OrderDetailsPopup", () => {
  it("renders all order info and items", () => {
    render(
      <OrderDetailsPopup
        order={mockOrder}
        customerName="Yordanos Hagos"
        kioskName="Merry Hagos"
        products={productsMap}
        onClose={() => {}}
      />
    );

    expect(screen.getByText(/Order Details - #3/)).toBeInTheDocument();
    expect(screen.getByText(/Yordanos Hagos/)).toBeInTheDocument();
    expect(screen.getByText(/Merry Hagos/)).toBeInTheDocument();
    expect(screen.getByText(/Completed/)).toBeInTheDocument();
    expect(screen.getByText(/Paid/)).toBeInTheDocument();


const totalItemsElements = screen.getAllByText((content, node) =>
  node.textContent.includes("Total Items:") && node.textContent.includes("13")
);
expect(totalItemsElements.length).toBeGreaterThan(0);

const totalPriceElements = screen.getAllByText((content, node) =>
  node.textContent.includes("Total Price") && node.textContent.includes("1,225.99")
);
expect(totalPriceElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/Tomatoes/)).toBeInTheDocument();
    expect(screen.getByText(/Onions/)).toBeInTheDocument();
    expect(screen.getAllByText("4")).toHaveLength(1);  
    expect(screen.getByText("128.00")).toBeInTheDocument();
    expect(screen.getByText("512.00")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button", () => {
    const handleClose = jest.fn();
    render(
      <OrderDetailsPopup
        order={mockOrder}
        customerName="Yordanos"
        kioskName="Kiosk"
        products={productsMap}
        onClose={handleClose}
      />
    );
    fireEvent.click(screen.getByLabelText(/close popup/i));
    expect(handleClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking the overlay", () => {
    const handleClose = jest.fn();
    render(
      <OrderDetailsPopup
        order={mockOrder}
        customerName="Yordanos"
        kioskName="Kiosk"
        products={productsMap}
        onClose={handleClose}
      />
    );
    fireEvent.click(screen.getByTestId("popup-overlay"));
    expect(handleClose).toHaveBeenCalled();
  });

  it("does not call onClose when clicking inside the content", () => {
    const handleClose = jest.fn();
    render(
      <OrderDetailsPopup
        order={mockOrder}
        customerName="Yordanos"
        kioskName="Kiosk"
        products={productsMap}
        onClose={handleClose}
      />
    );
    fireEvent.click(screen.getByTestId("popup-content"));
    expect(handleClose).not.toHaveBeenCalled();
  });
});
