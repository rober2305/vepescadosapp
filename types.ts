
export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  stockKg: number;
  category?: string;
  lastUpdated?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantityKg: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
}

export interface DispatchItem {
  productId: string;
  productName: string;
  quantityKg: number;
  returnedKg: number;
  priceAtDispatch: number;
  totalKg: number;
  totalAmount: number;
}

export interface Dispatch {
  id: string;
  recipient: string;
  timestamp: string;
  items: DispatchItem[];
  totalKg: number;
  totalAmount: number;
  closeData?: DailyClose;
}

export interface DailyClose {
  ptoBs: number;
  efectivoBs: number;
  pagoMovil: number;
  gastos: number;
  donaciones: number;
  transformacion: number;
  credito: number;
  comisiones: number;
  personal: number;
  tasaCambio: number;
}

export interface Transaction {
  id: string;
  type: 'ingreso' | 'egreso';
  description: string;
  amount: number;
  timestamp: string;
}

export interface Purchase {
  id: string;
  provider: string;
  productName: string;
  quantityKg: number;
  totalCost: number;
  timestamp: string;
}

export type View = 'inicio' | 'despachos' | 'ventas' | 'compras' | 'finanzas' | 'inventario';
