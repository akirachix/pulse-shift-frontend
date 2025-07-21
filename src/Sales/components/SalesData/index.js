const generateRandomSalesData = (count, min, max) => {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };
  
  const vendorNames = [
    "Mama Achieng", 
    "Mama Neema", 
    "Mama Nura", 
    "Mama Aisha", 
    "Mama Karen",
    "Mama Kimani"
  ];
  
  export const getSalesData = async (timeRange, month, week) => {

    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (timeRange === 'month') {
     
      const daysInMonth = 30;
      const dailySales = generateRandomSalesData(daysInMonth, 500, 5000);
      
      return Array.from({ length: daysInMonth }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: dailySales[i],
      }));
    } else {
    
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklySales = generateRandomSalesData(7, 800, 6000);
      
      return dayNames.map((day, i) => ({
        label: day,
        value: weeklySales[i],
      }));
    }
  };
  
  export const getPopularProducts = async (timeRange, month, week) => {
  
    await new Promise(resolve => setTimeout(resolve, 300));
  
    const productSales = generateRandomSalesData(5, 50, 500);
    
    return vendorNames.slice(0, 5).map((name, i) => ({
      name: name,
      value: productSales[i],
    }));
  };