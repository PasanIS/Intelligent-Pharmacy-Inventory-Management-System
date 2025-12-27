export interface Drug {
  brandName: string;
  genericName: string;
  dosage: string;
  category: string;
  currentStock: number;
  expiryDate: string;
  supplier: string;
  batchNumber: string;
  unitPrice: number;
}

export interface InventoryItem {
  id?: number;
  brandName: string;
  genericName: string;
  dosage: string;
  categoryId: number | null;
  supplierId: number | null;
  currentStock: number;
  expiryDate: string;
  batchNumber: string;
  unitPrice: number;
  minStockThreshold?: number;
  categoryName?: string;
  supplierName?: string;
  manufacturedDate?: string;
  unit?: string;
}

export interface Supplier {
  id?: number;
  supplierName: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id?: number;
  inventoryItemId: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantityChange: number;
  reason?: string;
  timestamp?: string;
  performedBy?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Alert {
  type: 'Expiring Soon' | 'Low Stock';
  // -----Fields for Expiring Soon items
  brandName?: string;
  batchNumber?: string;
  quantity?: number;
  expiryDate?: string;
  daysRemaining?: number;
  // -----Fields for Low Stock/Reorder items
  drugName?: string;
  suggestedQuantity?: number;
  reason?: string;
  status?: string;
  action: 'Reorder' | 'Discard' | 'Review';
}

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface DashboardSummary {
  totalInventoryValue: string;
  lowStockItemCount: number;
  expiringSoonCount: number;
  stockLevelsByCategory: Array<{ categoryName: string; currentStock: number }>;
  recentTransactions: string[];
  // ------New fields for charts
  categoryBreakdown: CategoryBreakdownData[];
  inventoryValue: InventoryValueData[];
  stockLevels: StockLevelData[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface CategoryBreakdownData {
  name: string;
  value: number;
  color: string;
}

export interface InventoryValueData {
  date: string;
  value: number;
  category: string;
}

export interface StockLevelData {
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
}
