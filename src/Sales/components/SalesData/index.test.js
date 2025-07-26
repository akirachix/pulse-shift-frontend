import { getSalesData, getPopularProducts } from '.'; 

describe('SalesData functions', () => {
  jest.setTimeout(10000); 

  test('getSalesData returns correct monthly data', async () => {
    const result = await getSalesData('month', 7, null); 
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(30);
    
    result.forEach((item, index) => {
      expect(item).toHaveProperty('label', `Day ${index + 1}`);
      expect(typeof item.value).toBe('number');
      expect(item.value).toBeGreaterThanOrEqual(500);
      expect(item.value).toBeLessThanOrEqual(5000);
    });
  });

  test('getSalesData returns correct weekly data', async () => {
    const result = await getSalesData('week', null, 1); 
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(7); 

    const expectedLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    result.forEach((item, index) => {
      expect(item).toHaveProperty('label', expectedLabels[index]);
      expect(typeof item.value).toBe('number');
      expect(item.value).toBeGreaterThanOrEqual(800);
      expect(item.value).toBeLessThanOrEqual(6000);
    });
  });

  test('getPopularProducts returns correct vendor data', async () => {
    const result = await getPopularProducts('month', 7, null);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);

    const vendorNames = [
      "Mama Achieng",
      "Mama Neema",
      "Mama Nura",
      "Mama Aisha",
      "Mama Karen"
    ];

    result.forEach((item, index) => {
      expect(item).toHaveProperty('name', vendorNames[index]);
      expect(typeof item.value).toBe('number');
      expect(item.value).toBeGreaterThanOrEqual(50);
      expect(item.value).toBeLessThanOrEqual(500);
    });
  });
});
