import React, { useState } from "react";
import { useFetchOrders } from "../hooks/useFetchonOrders";
import { useFetchUsers } from "../hooks/useFetchonUsers";
import { useFetchOrderItems } from "../hooks/useFetchonOrderItems";
import OrderDetailsPopup from "../OrderDetailsPopup";
import "./index.css";

const Orders = ({ onSelectMamaMboga }) => {
  const { loading: ordersLoading, error: ordersError, orders } = useFetchOrders();
  const { loading: usersLoading, error: usersError, users } = useFetchUsers();
  const { loading: orderItemsLoading, error: orderItemsError, orderItems } = useFetchOrderItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const ORDERS_PER_PAGE = 6;

  const customerLookup = users.reduce((acc, user) => {
    if (user.user_type === "customer") {
      acc[user.id] = `${user.first_name} ${user.last_name}`;
    }
    return acc;
  }, {});

  const mamaMbogaLookup = users.reduce((acc, user) => {
    if (user.user_type === "mama_mboga") {
      acc[user.id] = `${user.first_name} ${user.last_name}`;
    }
    return acc;
  }, {});

  const orderToMamaMbogaMap = orderItems.reduce((acc, item) => {
    if (item.order && item.mama_mboga) {
      if (!acc[item.order]) {
        acc[item.order] = item.mama_mboga;
      }
    }
    return acc;
  }, {});

  const filteredOrders = orders.filter(order => {
    const orderIdStr = order.order_id.toString();
    const custName = customerLookup[order.customer]?.toLowerCase() || "";

    const matchesSearch =
      orderIdStr.includes(searchTerm.toLowerCase()) ||
      custName.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "pending") return order.current_status?.toLowerCase() === "pending";
    if (filter === "confirmed") return order.current_status?.toLowerCase() === "confirmed";
    return true; 
  });

  const displayedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.order_date) - new Date(a.order_date)
  );

  const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;
  const currentOrders = displayedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(displayedOrders.length / ORDERS_PER_PAGE);

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = ordersLoading || usersLoading || orderItemsLoading;
  const error = ordersError || usersError || orderItemsError;

  const openOrderDetails = (order) => {
    const itemsOfOrder = orderItems.filter(item => item.order === order.order_id);
    setSelectedOrder({ ...order, orderItems: itemsOfOrder });
  };

  const closePopup = () => setSelectedOrder(null);

  const handlePaymentClick = (orderId) => {
    alert(`Payment details for Order ID: ${orderId}`);
  };

  console.log("Orders:", orders);
  console.log("Filter:", filter);
  console.log("Filtered Orders:", filteredOrders);
  console.log(
    "Unique Statuses:",
    [...new Set(orders.map(order => order.current_status))].filter(Boolean)
  );

  return (
    <div className="orders-page">
      <h2>Mama Mboga Orders Overview</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by order ID or customer name..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        <select
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && filteredOrders.length === 0 && (
        <p className="no-orders">
          No orders match the selected filter ({filter === "pending" ? "Pending" : filter === "confirmed" ? "Confirmed" : "All"}).
        </p>
      )}

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Kiosk Name</th>
            <th>Order Status</th>
            <th>Payment</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length === 0 ? (
            <tr><td colSpan="7" className="no-orders">No orders found.</td></tr>
          ) : (
            currentOrders.map((order, index) => {
              const customerName = customerLookup[order.customer] || "Unknown Customer";
              const mamaMbogaId = orderToMamaMbogaMap[order.order_id];
              const kioskName = mamaMbogaLookup[mamaMbogaId] || "Unknown Kiosk";

              return (
                <tr
                  key={order.order_id}
                  className="order-row"
                  onClick={() => openOrderDetails(order)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{order.order_id}</td>
                  <td>{customerName}</td>
                  <td>{kioskName}</td>
                  <td className={`status ${order.current_status?.toLowerCase() || ""}`}>
                    {order.current_status || "Unknown"}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    {order.payment_status?.toLowerCase() === "pending" ? (
                      <button
                        className="payment-btn pending"
                        onClick={() => handlePaymentClick(order.order_id)}
                      >
                        pending
                      </button>
                    ) : order.payment_status?.toLowerCase() === "canceled" || index === 6 ? (
                      <button
                        className="payment-btn refund"
                        onClick={() => alert(`Order ID ${order.order_id} is refunded/canceled.`)}
                      >
                        refund
                      </button>
                    ) : (
                      <button
                        className="payment-btn"
                        onClick={() => handlePaymentClick(order.order_id)}
                      >
                        {order.payment_status || "Unknown"}
                      </button>
                    )}
                  </td>
                  <td>{formatDateTime(order.order_date)}</td>
                  <td className="view-column">View</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          customerName={customerLookup[selectedOrder.customer] || "Unknown Customer"}
          kioskName={mamaMbogaLookup[orderToMamaMbogaMap[selectedOrder.order_id]] || "Unknown Kiosk"}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Orders;