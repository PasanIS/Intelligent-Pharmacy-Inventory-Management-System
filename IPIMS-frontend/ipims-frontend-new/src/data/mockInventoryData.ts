// Mock data for inventory charts and analytics

// export interface InventoryValueData {
//   date: string;
//   value: number;
//   category: string;
// }

// export interface StockLevelData {
//   category: string;
//   currentStock: number;
//   minStock: number;
//   maxStock: number;
// }

// export interface CategoryBreakdownData {
//   name: string;
//   value: number;
//   color: string;
// }

// Mock inventory value over time data (last 12 months) - COMMENTED OUT FOR DATABASE INTEGRATION
// export const inventoryValueData: InventoryValueData[] = [
//   { date: '2024-01', value: 125000, category: 'Total' },
//   { date: '2024-02', value: 132000, category: 'Total' },
//   { date: '2024-03', value: 128000, category: 'Total' },
//   { date: '2024-04', value: 145000, category: 'Total' },
//   { date: '2024-05', value: 152000, category: 'Total' },
//   { date: '2024-06', value: 148000, category: 'Total' },
//   { date: '2024-07', value: 165000, category: 'Total' },
//   { date: '2024-08', value: 172000, category: 'Total' },
//   { date: '2024-09', value: 168000, category: 'Total' },
//   { date: '2024-10', value: 185000, category: 'Total' },
//   { date: '2024-11', value: 192000, category: 'Total' },
//   { date: '2024-12', value: 198000, category: 'Total' },
// ];

// Stock levels by category - COMMENTED OUT FOR DATABASE INTEGRATION
// export const stockLevelData: StockLevelData[] = [
//   { category: 'Medicines', currentStock: 1250, minStock: 800, maxStock: 2000 },
//   { category: 'Medical Supplies', currentStock: 450, minStock: 300, maxStock: 800 },
//   { category: 'Equipment', currentStock: 85, minStock: 50, maxStock: 150 },
//   { category: 'Vaccines', currentStock: 320, minStock: 200, maxStock: 500 },
//   { category: 'Surgical Items', currentStock: 180, minStock: 100, maxStock: 300 },
// ];

// Category breakdown for pie chart - COMMENTED OUT FOR DATABASE INTEGRATION
// export const categoryBreakdownData: CategoryBreakdownData[] = [
//   { name: 'Medicines', value: 125000, color: '#8884d8' },
//   { name: 'Medical Supplies', value: 35000, color: '#82ca9d' },
//   { name: 'Equipment', value: 25000, color: '#ffc658' },
//   { name: 'Vaccines', value: 18000, color: '#ff7c7c' },
//   { name: 'Surgical Items', value: 12000, color: '#8dd1e1' },
// ];

// Recent inventory movements (for dashboard display) - COMMENTED OUT FOR DATABASE INTEGRATION
// export const recentMovements = [
//   { item: 'Ibuprofen 400mg', type: 'Received', quantity: 50, date: '2024-12-20' },
//   { item: 'Amoxicillin 500mg', type: 'Dispensed', quantity: 10, date: '2024-12-20' },
//   { item: 'Aspirin 100mg', type: 'Adjusted', quantity: 2, date: '2024-12-19' },
//   { item: 'Paracetamol 500mg', type: 'Received', quantity: 100, date: '2024-12-19' },
//   { item: 'Bandages', type: 'Received', quantity: 200, date: '2024-12-18' },
//   { item: 'Syringes', type: 'Dispensed', quantity: 25, date: '2024-12-18' },
// ];

// Low stock alerts - COMMENTED OUT FOR DATABASE INTEGRATION
// export const lowStockAlerts = [
//   { item: 'Insulin Pens', currentStock: 15, minStock: 50 },
//   { item: 'Blood Pressure Monitors', currentStock: 3, minStock: 10 },
//   { item: 'Surgical Gloves', currentStock: 45, minStock: 100 },
//   { item: 'Antiseptic Solution', currentStock: 8, minStock: 20 },
// ];

// Monthly comparison data - COMMENTED OUT FOR DATABASE INTEGRATION
// export const monthlyComparison = [
//   { month: 'Jan', thisYear: 125000, lastYear: 118000 },
//   { month: 'Feb', thisYear: 132000, lastYear: 122000 },
//   { month: 'Mar', thisYear: 128000, lastYear: 125000 },
//   { month: 'Apr', thisYear: 145000, lastYear: 135000 },
//   { month: 'May', thisYear: 152000, lastYear: 140000 },
//   { month: 'Jun', thisYear: 148000, lastYear: 142000 },
//   { month: 'Jul', thisYear: 165000, lastYear: 155000 },
//   { month: 'Aug', thisYear: 172000, lastYear: 160000 },
//   { month: 'Sep', thisYear: 168000, lastYear: 158000 },
//   { month: 'Oct', thisYear: 185000, lastYear: 175000 },
//   { month: 'Nov', thisYear: 192000, lastYear: 180000 },
//   { month: 'Dec', thisYear: 198000, lastYear: 185000 },
// ];