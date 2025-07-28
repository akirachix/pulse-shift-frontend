
import { useState } from "react";
import { formatDate } from "../../../utils/dateUtils";

const numberWithCommas = (n) => n?.toLocaleString() || "0";

const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

export default function RecentOrdersTable({ orders, customerMap }) {
    console.log({orders});
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    console.log({currentOrders});
    

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="dashboard-section">
            <div className="dashboard-table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Customer Name</th>
                            <th>Kiosk Name</th>
                            <th>Order Status</th>
                            <th>Date</th>
                            <th>Amount(KES)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order, index) => (
                            <tr key={order.order_id}>
                                <td>{index + 1}</td>
                                <td>{formatDate(order.order_date)}</td>
                                <td>{customerMap[order.customer] || "Unknown Customer"}</td>
                                <td>
                                    <span className={"status-badge " + (order.current_status?.toLowerCase() || '')}>
                                        {capitalizeFirstLetter(order.current_status)}
                                    </span>
                                </td>
                                <td>
                                    <span className={"status-badge " + (order.payment_status?.toLowerCase() || '')}>
                                        {capitalizeFirstLetter(order.payment_status)}
                                    </span>
                                </td>
                                <td>{numberWithCommas(parseFloat(order.total_amount || 0))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "20px 0",
                        gap: "8px"
                    }}
                >
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            backgroundColor: "white",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                            opacity: currentPage === 1 ? 0.5 : 1,
                            borderRadius: "4px"
                        }}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            style={{
                                padding: "8px 12px",
                                border: "1px solid #ccc",
                                backgroundColor: currentPage === i + 1 ? "#00c321" : "white",
                                color: currentPage === i + 1 ? "white" : "#333",
                                fontWeight: currentPage === i + 1 ? "bold" : "normal",
                                cursor: "pointer",
                                borderRadius: "4px"
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            backgroundColor: "white",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            borderRadius: "4px"
                        }}
                    >
                        Next
                    </button>
                </div>

            )}
        </div>
    );
}