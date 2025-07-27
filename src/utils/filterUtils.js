export const filterByDateRange = (data, startDate, endDate, dateField = 'order_date') => {
    if (!data || !startDate || !endDate) return data || [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= start && itemDate <= end;
    });
};

export const filterByDay = (data, date) => {
    if (!data || !date) return data || [];
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return data.filter(item => {
        const itemDate = new Date(item.order_date);
        return itemDate >= dayStart && itemDate <= dayEnd;
    });
};

export const filterByWeek = (data) => {
    if (!data) return [];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return data.filter(item => {
        const itemDate = new Date(item.order_date);
        return itemDate >= weekStart && itemDate <= weekEnd;
    });
};

export const filterByMonth = (data) => {
    if (!data) return [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
    return data.filter(item => {
        const itemDate = new Date(item.order_date);
        return itemDate >= monthStart && itemDate <= monthEnd;
    });
};