import React from "react";
import "./OrderDetailsPopup.css";

const OrderDetailsPopup = ({ order, customerName, kioskName, onClose, products = {} }) => {
  if (!order) return null;

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const totalItems =
    order.orderItems?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;

  const totalPrice =
    order.orderItems?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;

  const statusClass = (order.current_status || "").toLowerCase();
  const paymentClass = (order.payment_status || "").toLowerCase();

  return (
    <div className="popup-overlay" onClick={onClose} data-testid="popup-overlay">
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
        data-testid="popup-content"
      >
        <button className="close-btn" onClick={onClose} aria-label="Close popup">
          ×
        </button>

        <h3>
          Order Details - #{order.order_id}
        </h3>

        <div className="order-main-info-row">
          <div className="order-info-col">
            <span>
              <strong>Customer:</strong> {customerName}
            </span>
            <span>
              <strong>Kiosk:</strong> {kioskName}
            </span>
            <span>
              <strong>Order Status:</strong>
              <span className={`status-pill ${statusClass}`}>{order.current_status}</span>
            </span>
            <span>
              <strong>Payment Status:</strong>
              <span className={`payment-pill ${paymentClass}`}>{order.payment_status}</span>
            </span>
          </div>
          <div className="order-info-col" style={{textAlign: "right"}}>
            <span>
              <strong>Order Date:</strong> {formatDateTime(order.order_date)}
            </span>
            <span>
              <strong>Total Items:</strong> {totalItems}
            </span>
            <span>
              <strong>Total Price (Ksh):</strong> {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div style={{margin: "14px 0 0 0"}}><strong>Items:</strong></div>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price per Unit (Ksh)</th>
              <th>Subtotal (Ksh)</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item) => {
                const quantity = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price_per_unit_at_order) || 0;
                const subtotal = parseFloat(item.item_total) || quantity * price;
                const productName = products[item.product]?.name || `Product #${item.product}`;
                return (
                  <tr key={item.order_item_id}>
                    <td>{productName}</td>
                    <td>{quantity}</td>
                    <td>{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailsPopup;
