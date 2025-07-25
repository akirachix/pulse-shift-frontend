export const processSalesData = ({
  users,
  orderItems,
  orders,
  timeRange,
  selectedMonth,
  selectedWeek,
}) => {
  try {
    const mamaMbogas = users.filter((u) => u.user_type === 'mama_mboga');
    const mamaMbogaMap = mamaMbogas.reduce((map, user) => {
      map[user.id] = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      return map;
    }, {});

    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, selectedMonth - 1, 1);
    const endOfMonth = new Date(year, selectedMonth, 0);
    let startDate = startOfMonth;
    let endDate = endOfMonth;

    if (timeRange === 'week') {
      startDate = new Date(year, selectedMonth - 1, 1 + (selectedWeek - 1) * 7);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      if (endDate > endOfMonth) endDate = endOfMonth;
    }

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const orderIds = new Set(filteredOrders.map((o) => o.order_id));
    const filteredOrderItems = orderItems.filter((item) => orderIds.has(item.order));

    const totalSales = filteredOrderItems.reduce(
      (sum, item) => sum + parseFloat(item.item_total || 0),
      0
    );

    let salesData = [];
    if (timeRange === 'month') {
      const daysInMonth = endOfMonth.getDate();
      salesData = Array.from({ length: daysInMonth }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 0,
      }));
      filteredOrderItems.forEach((item) => {
        const order = filteredOrders.find((o) => o.order_id === item.order);
        if (!order) return;
        salesData[new Date(order.order_date).getDate() - 1].value += parseFloat(
          item.item_total || 0
        );
      });
    } else {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      salesData = weekdays.map((day) => ({ label: day, value: 0 }));
      filteredOrderItems.forEach((item) => {
        const order = filteredOrders.find((o) => o.order_id === item.order);
        if (!order) return;
        salesData[new Date(order.order_date).getDay()].value += parseFloat(
          item.item_total || 0
        );
      });
    }

    const salesByMamaMboga = filteredOrderItems.reduce((acc, item) => {
      const id = item.mama_mboga;
      acc[id] = (acc[id] || 0) + parseFloat(item.item_total || 0);
      return acc;
    }, {});

    const popularProducts = Object.entries(salesByMamaMboga)
      .map(([id, value]) => ({
        name: mamaMbogaMap[id] || `Mama Mboga ${id}`,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { salesData, popularProducts, totalSales };
  } catch (error) {
    console.error('[processSalesData] Error processing sales data:', error);
    return {
      salesData: [],
      popularProducts: [],
      totalSales: 0,
    };
  }
};
