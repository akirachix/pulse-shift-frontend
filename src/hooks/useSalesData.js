import { useEffect, useState, useCallback } from 'react';
import { useUsers } from './useUsers';
import { useOrders } from './useOrders';
import { useOrderItems } from './useOrderItems';
import { processSalesData } from '../utils/fetchSales';

export const useSalesData = (timeRange, selectedMonth, selectedWeek) => {
  const {
    users,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers();

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useOrders();

  const {
    orderItems,
    loading: orderItemsLoading,
    error: orderItemsError,
    refetch: refetchOrderItems,
  } = useOrderItems();

  const [salesData, setSalesData] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [processingError, setProcessingError] = useState(null);

  const loading = usersLoading || ordersLoading || orderItemsLoading;
  const error = usersError || ordersError || orderItemsError || processingError;

  const loadSales = useCallback(() => {
    if (!loading && !error && users.length && orders.length && orderItems.length) {
      try {
        const { salesData, popularProducts, totalSales } = processSalesData({
          users,
          orders,
          orderItems,
          timeRange,
          selectedMonth,
          selectedWeek,
        });
        setSalesData(salesData);
        setPopularProducts(popularProducts);
        setTotalSales(totalSales);
        setProcessingError(null);
      } catch (e) {
        setProcessingError(e);
        setSalesData([]);
        setPopularProducts([]);
        setTotalSales(0);
      }
    }
  }, [users, orders, orderItems, loading, error, timeRange, selectedMonth, selectedWeek]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const refetchAll = () => {
    try {
      refetchUsers();
      refetchOrders();
      refetchOrderItems();
    } catch (e) {
      setProcessingError(e);
    }
  };

  return { salesData, popularProducts, totalSales, loading, error, refetch: refetchAll };
};
