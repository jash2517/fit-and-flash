export type ProductCategory = 't-shirts' | 'hoodies' | 'shirts' | 'denim' | 'sneakers';

export type ProductStatus = 'live' | 'sold-out' | 'local-vault';

export type ModelType = 'apparel' | 'hoodie' | 'denim' | 'sneaker' | 'shirt';

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stockCount: number;
  initialStock: number;
  status: ProductStatus;
  discount?: number;
  hubLocation?: string;
  expressDelivery?: boolean;
  image: string;
  gallery: string[];
  countdownSeconds: number; // initial countdown remaining in seconds
  dropEndTime: number; // timestamp
  description: string;
  details: string[];
  modelType: ModelType;
  availableSizes: string[];
  waitlistCount?: number;
  fabricSpec?: string;
  batchCode?: string;
}

export interface StockLock {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  size: string;
  userId: string;
  userName: string;
  lockedAt: number;
  expiresAt: number;
  remainingSeconds: number;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export type OrderStatus =
  | 'Stock Locked'
  | 'Confirmed'
  | 'Dispatched (24h Express)'
  | 'Delivered'
  | 'Return Requested'
  | 'Returned to Vault';

export interface Order {
  id: string;
  trackingId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  size: string;
  paymentMethod: PaymentMethod;
  paymentDetails: string;
  status: OrderStatus;
  createdAt: number;
  hubLocation: string;
  userRole: 'shopper-a' | 'shopper-b' | 'merchant' | 'guest';
  userPhone: string;
  canReturn: boolean;
  tagScanVerified?: boolean;
  rfidTag?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  size: string;
  price: number;
  shopperId: string;
  hubLocation: string;
  rfidTag: string;
  condition: string;
  status: 'pending_scan' | 'scanned_and_routed' | 'merchant_approved';
  timestamp: number;
}

export interface LiveEvent {
  id: string;
  timestamp: string;
  user: string;
  action: 'LOCK_STOCK' | 'CHECKOUT_SUCCESS' | 'WAITLIST_JOIN' | 'LOCK_EXPIRED' | 'RETURN_SCAN' | 'VAULT_PUBLISHED';
  details: string;
  status: 'success' | 'warn' | 'info' | 'urgent';
}

export type UserRole = 'shopper-a' | 'shopper-b' | 'merchant';

export interface UserProfile {
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  hub: string;
}

export interface FitDimensions {
  // For apparel
  chest: number; // 80 - 130 cm
  waist: number; // 60 - 110 cm
  height: number; // 150 - 210 cm
  // For shoes
  footLength?: number; // 23 - 31 cm
  footWidth?: number; // 8 - 12 cm
  archHeight?: number; // 2 - 5 cm
}

export interface FitCalculationResult {
  score: number; // 0 - 100
  verdict: 'tight' | 'ideal' | 'relaxed';
  verdictText: string;
  tensionColor: 'red' | 'green' | 'blue';
  tensionZones: {
    chestTension: number; // 0 to 1
    waistTension: number;
    shouldersTension: number;
  };
}

