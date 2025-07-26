import { useOrders } from "../hooks/useFetchOrders";
import { useOrdersDetails } from "../hooks/useFetchOrderDetails";
import { usePayments } from "../hooks/usePayments";
import { useCustomers } from "../hooks/useCustomers";
import { useMamambogas } from "../hooks/useMamaMboga";
import { useEffect, useMemo, useState } from "react";
import { filterByDateRange, filterByDay, filterByMonth, filterByWeek } from "../utils/filterUtils";
import { computeCustomerInsights, computeGrossSales, computeOrdersOverTime, computeOrderStatusData, computeTopVendors } from "../utils/computeUtils";
import UserProfile from "./components/Profile";
import DashboardCards from "./components/DashboardCards";
import { TopVendorsChart } from "./components/TopVendorsChart";
import { OrderStatusPieChart } from "./components/OrderStatusPieChart";
import { CustomerInsightsPieChart } from "./components/CustomerInsightsPieChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import { OrdersOverTimeChart } from "./components/OrdersOverTimeChart";
import DashboardFilter from "./components/DashboardFilter";
import "./index.css"

export default function AdminDashboard() {
  const [filterType, setFilterType] = useState("week");
  const [customDate, setCustomDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [search, setSearch] = useState("");
  const [dashboardError, setDashboardError] = useState(null);

  const [startDate, endDate] = dateRange;

  const { orders, loading: loadingOrders, error: errorOrders } = useOrders();
  const { orders_items, loading: loadingOrdersItems, error: errorOrdersItems } = useOrdersDetails();
  const { payments, loading: loadingPayments, error: errorPayments } = usePayments();
  const { customers, loading: loadingCustomers, error: errorCustomers } = useCustomers();
  const { mamambogas, loading: loadingMamambogas, error: errorMamambogas } = useMamambogas();

  const allErrors = errorOrders || errorOrdersItems || errorPayments || errorCustomers || errorMamambogas;
  const loading = loadingOrders || loadingOrdersItems || loadingPayments || loadingCustomers || loadingMamambogas;

  const [dashboardData, setDashboardData] = useState({
    summary: [],
    ordersOverTime: [],
    topVendors: [],
    orderStatusData: [],
    recentOrders: [],
    customerInsights: [],
  });

  useEffect(() => {
    if (loading) return;

    if (allErrors) {
      setDashboardError(allErrors);
      return;
    }

    let filteredOrders = orders || [];
    let filterError = null;

    switch (filterType) {
      case "day":
        if (customDate) {
          filteredOrders = filterByDay(orders, customDate);
        } else {
          filteredOrders = [];
          filterError = "Please select a date.";
        }
        break;
      case "week":
        filteredOrders = filterByWeek(orders);
        break;
      case "month":
        filteredOrders = filterByMonth(orders);
        break;
      case "dateRange":
        if (startDate && endDate) {
          filteredOrders = filterByDateRange(orders, startDate, endDate);
        } else {
          filteredOrders = [];
          filterError = "Please select a valid date range.";
        }
        break;
      default:
        break;
    }

    const filteredOrderIds = new Set(filteredOrders.map((order) => order.order_id));
    const filteredOrderItems = (orders_items || []).filter((item) =>
      filteredOrderIds.has(item.order)
    );
    const filteredPayments = (payments || []).filter((payment) =>
      filteredOrderIds.has(payment.order)
    );

    setDashboardData({
      summary: [
        { title: "Vendors", value: mamambogas?.length || 0 },
        { title: "Customers", value: customers?.length || 0 },
        { title: "Orders", value: filteredOrders.length },
        { title: "Gross Sales", value: computeGrossSales(filteredPayments) },
      ],
      ordersOverTime: computeOrdersOverTime(filteredOrders),
      topVendors: computeTopVendors(filteredOrderItems, mamambogas),
      orderStatusData: computeOrderStatusData(filteredOrders),
      recentOrders: filteredOrders
        .slice()
        .sort((a, b) => {
          const aDate = a.order_date ? new Date(a.order_date) : 0;
          const bDate = b.order_date ? new Date(b.order_date) : 0;
          return bDate - aDate;
        }),
      customerInsights: computeCustomerInsights(customers),
    });

    setDashboardError(filterError);
  }, [
    filterType,
    customDate,
    startDate,
    endDate,
    orders,
    orders_items,
    payments,
    customers,
    mamambogas,
    loading,
    allErrors,
  ]);

  const customerMap = useMemo(() => {
    if (!customers) return {};
    return customers.reduce((acc, cust) => {
      acc[cust.id] = cust.first_name || cust.email;
      return acc;
    }, {});
  }, [customers]);

  const filteredOrders = dashboardData.recentOrders.filter((order) => {
    const customerName = customerMap[order.customer] || "";
    const status = order.current_status || "";
    return (
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      status.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <UserProfile />
        <h1>Admin Dashboard</h1>
        <DashboardFilter
          filterType={filterType}
          setFilterType={setFilterType}
          customDate={customDate}
          setCustomDate={setCustomDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
          error={dashboardError}
        />
      </div>

      {dashboardError && (
        <p style={{ color: "red", margin: "20px" }}>{dashboardError}</p>
      )}

      {loading && (
        <div className="loading-overlay">
          <p>Loading data...</p>
        </div>
      )}

      <DashboardCards summary={dashboardData.summary} />

      <div className="dashboard-charts-section">
        <OrdersOverTimeChart data={dashboardData.ordersOverTime} />
        <TopVendorsChart data={dashboardData.topVendors} />
        <OrderStatusPieChart data={dashboardData.orderStatusData} />
        <CustomerInsightsPieChart data={dashboardData.customerInsights} />
      </div>

      <div className="dashboard-section">
        <h3>Recent Orders</h3>
        <div className="search-container">
          <label htmlFor="search">Search Orders</label>
          <input
            id="search"
            type="text"
            placeholder="Search by customer or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <RecentOrdersTable orders={filteredOrders} customerMap={customerMap} />
      </div>
    </div>
  );
}