const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const computeGrossSales = (payments) =>
    payments?.reduce((sum, p) => sum + Number(p.total_amount || 0), 0) || 0;

export const computeOrderStatusData = (orders) => {
    if (!orders) return [];
    const statusMap = orders.reduce((acc, order) => {
        const status = order.current_status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
};

export const computeTopVendors = (orders_items, mamambogas) => {
    if (!orders_items || !mamambogas) return [];
    const vendorMap = mamambogas.reduce((acc, vendor) => {
        acc[vendor.id] = vendor;
        return acc;
    }, {});

    const vendorSales = {};
    orders_items.forEach((item) => {
        const vendorUserId = item.mama_mboga;
        if (vendorUserId && vendorMap[vendorUserId]) {
            const vendorId = vendorMap[vendorUserId].id;
            vendorSales[vendorId] = (vendorSales[vendorId] || 0) + Number(item.item_total || 0);
        }
    });

    return Object.entries(vendorSales)
        .map(([vendorId, sales]) => {
            const vendor = mamambogas.find(m => String(m.id) === vendorId);
            return {
                id: vendorId,
                name: vendor?.first_name || `Vendor #${vendorId}`,
                sales,
            };
        })
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
};

export const computeOrdersOverTime = (orders) => {
    if (!orders) return [];
    const countsByDate = {};
    orders.forEach((order) => {
        const date = order.order_date ? formatDate(order.order_date) : "Unknown";
        countsByDate[date] = (countsByDate[date] || 0) + 1;
    });
    return Object.entries(countsByDate).map(([date, orders]) => ({ date, orders }));
};

export const computeCustomerInsights = (customers) => {
    if (!customers) return [];
    const newCount = customers.filter((cust) => cust.is_active).length;
    const returningCount = customers.length - newCount;
    return [
        { name: "New Customers", value: newCount },
        { name: "Returning Customers", value: returningCount },
    ];
};