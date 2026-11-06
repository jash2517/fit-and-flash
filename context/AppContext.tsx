'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  StockLock,
  Order,
  ReturnRequest,
  LiveEvent,
  UserProfile,
  UserRole,
  PaymentMethod,
  FitDimensions,
  FitCalculationResult
} from '@/types';
import { INITIAL_PRODUCTS, DEMO_USERS } from '@/data/initialProducts';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warn' | 'error' | 'info';
}

interface AppContextType {
  // User & Auth
  user: UserProfile;
  switchUserRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProductStock: (productId: string, newStock: number) => void;
  triggerFlashDrop: (productId: string, minutes: number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  joinWaitlist: (productId: string) => void;

  // 10-Min Atomic Stock Locks
  activeLock: StockLock | null;
  locks: StockLock[];
  lockStock: (product: Product, size: string) => { success: boolean; message: string };
  releaseLock: (lockId: string, reason?: string) => void;

  // Checkout & Orders
  orders: Order[];
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutProduct: { product: Product; size: string } | null;
  setCheckoutProduct: (data: { product: Product; size: string } | null) => void;
  completeCheckout: (method: PaymentMethod, details: string) => Order | null;
  latestOrder: Order | null;
  setLatestOrder: (order: Order | null) => void;

  // WhatsApp Drawer
  isWhatsAppOpen: boolean;
  setIsWhatsAppOpen: (open: boolean) => void;

  // 3D Fit Studio
  isFitStudioOpen: boolean;
  setIsFitStudioOpen: (open: boolean) => void;
  selectedFitProduct: Product | null;
  openFitStudio: (product: Product) => void;
  userDimensions: FitDimensions;
  setUserDimensions: React.Dispatch<React.SetStateAction<FitDimensions>>;
  calculateFitMatch: (product: Product, size: string, dimensions: FitDimensions) => FitCalculationResult;

  // Returns & Local Vault
  returns: ReturnRequest[];
  isReturnModalOpen: boolean;
  setIsReturnModalOpen: (open: boolean) => void;
  orderToReturn: Order | null;
  openReturnModal: (order: Order) => void;
  submitReturnScan: (orderId: string, rfidTag: string) => void;
  merchantApproveReturn: (returnId: string) => void;

  // Merchant Ops & Traffic Simulator
  trafficSimulatorRunning: boolean;
  toggleTrafficSimulator: () => void;
  events: LiveEvent[];
  clearEvents: () => void;
  stats: {
    activeLocksCount: number;
    totalRevenue: number;
    conversionRate: number;
    vaultItemsCount: number;
    soldOutCount: number;
  };

  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Navigation / active tab helper
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'fitflash_products_v1',
  LOCKS: 'fitflash_locks_v1',
  ORDERS: 'fitflash_orders_v1',
  RETURNS: 'fitflash_returns_v1',
  EVENTS: 'fitflash_events_v1',
  USER: 'fitflash_current_user_v1',
};

// Initial sample orders for Aarav Sharma (one delivered, one in transit) so return flow is testable immediately
const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821-X',
    trackingId: 'FF-TRK-88192-BLR',
    productId: 'ff-prod-01',
    productTitle: 'Acid Wash Oversized Tee',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    price: 1499,
    size: 'L',
    paymentMethod: 'upi',
    paymentDetails: 'UPI: aarav@okhdfcbank (REF: 491028392019)',
    status: 'Delivered',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    hubLocation: 'Bengaluru Hub - Indiranagar',
    userRole: 'shopper-a',
    userPhone: '+91 98201 44810',
    canReturn: true,
    rfidTag: 'TAG-9842-TEE-L'
  },
  {
    id: 'ORD-7419-B',
    trackingId: 'FF-TRK-44219-MUM',
    productId: 'ff-prod-04',
    productTitle: 'Plum Armor Hoodie',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    price: 2999,
    size: 'XL',
    paymentMethod: 'card',
    paymentDetails: 'HDFC Card •••• 4242',
    status: 'Dispatched (24h Express)',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    hubLocation: 'Mumbai Hub - Bandra West',
    userRole: 'shopper-a',
    userPhone: '+91 98201 44810',
    canReturn: false,
    rfidTag: 'TAG-1102-HOD-XL'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load user
  const [user, setUser] = useState<UserProfile>(DEMO_USERS['shopper-a']);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Locks
  const [locks, setLocks] = useState<StockLock[]>([]);
  const [activeLock, setActiveLock] = useState<StockLock | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(SAMPLE_INITIAL_ORDERS);

  // Returns
  const [returns, setReturns] = useState<ReturnRequest[]>([]);

  // Live event terminal logs
  const [events, setEvents] = useState<LiveEvent[]>([
    {
      id: 'evt-init-1',
      timestamp: new Date().toLocaleTimeString(),
      user: 'SYSTEM // HQ',
      action: 'VAULT_PUBLISHED',
      details: 'Flash&Fit High-Concurrency Engine Initialized. 18 drops loaded.',
      status: 'info',
    },
    {
      id: 'evt-init-2',
      timestamp: new Date().toLocaleTimeString(),
      user: 'Shopper_A91',
      action: 'LOCK_STOCK',
      details: 'Atomic 10-Min Lock placed on KABUKICHO OVERSIZED ACID-WASH TEE [Size L]',
      status: 'success',
    }
  ]);

  // Modals & Drawers
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{ product: Product; size: string } | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const [isFitStudioOpen, setIsFitStudioOpen] = useState(false);
  const [selectedFitProduct, setSelectedFitProduct] = useState<Product | null>(null);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [orderToReturn, setOrderToReturn] = useState<Order | null>(null);

  // Body Dimensions
  const [userDimensions, setUserDimensions] = useState<FitDimensions>({
    chest: 104,
    waist: 82,
    height: 182,
    footLength: 27.5,
    footWidth: 10.2,
    archHeight: 3.5,
  });

  // Traffic Simulator
  const [trafficSimulatorRunning, setTrafficSimulatorRunning] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeSection, setActiveSection] = useState('storefront');

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addEvent = useCallback((event: Omit<LiveEvent, 'id' | 'timestamp'>) => {
    const newEvt: LiveEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEvents((prev) => [newEvt, ...prev.slice(0, 49)]); // keep last 50 events
  }, []);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProds) {
        setProducts(JSON.parse(storedProds));
      }
      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
      const storedLocks = localStorage.getItem(STORAGE_KEYS.LOCKS);
      if (storedLocks) {
        const parsedLocks: StockLock[] = JSON.parse(storedLocks);
        const now = Date.now();
        // filter out expired
        const validLocks = parsedLocks.filter((l) => l.expiresAt > now);
        setLocks(validLocks);
      }
      const storedReturns = localStorage.getItem(STORAGE_KEYS.RETURNS);
      if (storedReturns) {
        setReturns(JSON.parse(storedReturns));
      }
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        const role = storedUser as UserRole;
        if (DEMO_USERS[role]) {
          setUser(DEMO_USERS[role]);
        }
      }
    } catch (err) {
      console.error('LocalStorage hydration error:', err);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCKS, JSON.stringify(locks));
    } catch {}
  }, [locks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returns));
    } catch {}
  }, [returns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, user.role);
    } catch {}
  }, [user]);

  // Keep activeLock in sync with current user's unexpired lock
  useEffect(() => {
    const userLock = locks.find((l) => l.userId === user.role && l.expiresAt > Date.now());
    setActiveLock(userLock || null);
  }, [locks, user.role]);

  // 1-second countdown ticker for stock locks and drop timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // Check for expired locks
      setLocks((prevLocks) => {
        let changed = false;
        const remaining: StockLock[] = [];
        prevLocks.forEach((lock) => {
          if (lock.expiresAt <= now) {
            changed = true;
            // Restore inventory atomically
            setProducts((prevProds) =>
              prevProds.map((p) => {
                if (p.id === lock.productId) {
                  return { ...p, stockCount: p.stockCount + 1 };
                }
                return p;
              })
            );
            addEvent({
              user: lock.userName,
              action: 'LOCK_EXPIRED',
              details: `10-min reservation expired for ${lock.productTitle}. Restored +1 to inventory.`,
              status: 'warn',
            });
            if (lock.userId === user.role) {
              addToast(`Stock reservation expired for ${lock.productTitle}. Item released.`, 'warn');
            }
          } else {
            remaining.push({
              ...lock,
              remainingSeconds: Math.max(0, Math.floor((lock.expiresAt - now) / 1000)),
            });
          }
        });
        return changed ? remaining : remaining;
      });

      // Ticker for product countdowns
      setProducts((prev) =>
        prev.map((p) => {
          if (p.status === 'live' && p.countdownSeconds > 0) {
            return { ...p, countdownSeconds: Math.max(0, p.countdownSeconds - 1) };
          }
          return p;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [user.role, addEvent, addToast]);

  // Dual-role switcher
  const switchUserRole = useCallback((role: UserRole) => {
    if (DEMO_USERS[role]) {
      setUser(DEMO_USERS[role]);
      addToast(`Switched profile to ${DEMO_USERS[role].name} (${role.toUpperCase()})`, 'success');
      addEvent({
        user: DEMO_USERS[role].name,
        action: 'LOCK_STOCK',
        details: `Active session swapped to [${role.toUpperCase()}]. Context re-synchronized.`,
        status: 'info',
      });
      if (role === 'merchant') {
        setActiveSection('merchant');
      } else {
        setActiveSection('storefront');
      }
    }
  }, [addToast, addEvent]);

  // 10-Minute Atomic Stock Lock
  const lockStock = useCallback(
    (product: Product, size: string): { success: boolean; message: string } => {
      if (product.stockCount <= 0) {
        addToast(`Drop is currently Sold Out! Join the waitlist.`, 'warn');
        return { success: false, message: 'Sold out' };
      }

      // Check if user already holds a lock for this item
      const existing = locks.find((l) => l.productId === product.id && l.userId === user.role);
      if (existing) {
        setCheckoutProduct({ product, size });
        setIsCheckoutOpen(true);
        addToast(`Resuming your active 10:00 lock for ${product.title}`, 'info');
        return { success: true, message: 'Lock active' };
      }

      const lockedAt = Date.now();
      const expiresAt = lockedAt + 10 * 60 * 1000; // precisely 10 minutes

      const newLock: StockLock = {
        id: `lock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        price: product.price,
        size,
        userId: user.role,
        userName: user.name,
        lockedAt,
        expiresAt,
        remainingSeconds: 600,
      };

      // Atomic stock reduction
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === product.id) {
            const nextCount = Math.max(0, p.stockCount - 1);
            return {
              ...p,
              stockCount: nextCount,
              status: nextCount === 0 ? 'sold-out' : p.status,
            };
          }
          return p;
        })
      );

      setLocks((prev) => [...prev, newLock]);
      setActiveLock(newLock);
      setCheckoutProduct({ product, size });
      setIsCheckoutOpen(true);

      addEvent({
        user: user.name,
        action: 'LOCK_STOCK',
        details: `Zero-Oversell Lock initialized: ${product.title} (${size}). 10:00 timer active.`,
        status: 'success',
      });

      addToast(`10:00 Stock Lock Secured for ${product.title}!`, 'success');
      return { success: true, message: 'Stock locked' };
    },
    [locks, user, addEvent, addToast]
  );

  const releaseLock = useCallback(
    (lockId: string, reason = 'User cancelled') => {
      setLocks((prev) => {
        const target = prev.find((l) => l.id === lockId);
        if (!target) return prev;

        // Restore stock atomically
        setProducts((prods) =>
          prods.map((p) => {
            if (p.id === target.productId) {
              return {
                ...p,
                stockCount: p.stockCount + 1,
                status: p.status === 'sold-out' ? 'live' : p.status,
              };
            }
            return p;
          })
        );

        addEvent({
          user: target.userName,
          action: 'LOCK_EXPIRED',
          details: `Lock released (${reason}) on ${target.productTitle}. Inventory restored.`,
          status: 'warn',
        });

        return prev.filter((l) => l.id !== lockId);
      });

      if (activeLock?.id === lockId) {
        setActiveLock(null);
      }
      setIsCheckoutOpen(false);
      addToast(`Lock released. Inventory returned to pool.`, 'info');
    },
    [activeLock, addEvent, addToast]
  );

  // Complete Payment & Checkout
  const completeCheckout = useCallback(
    (method: PaymentMethod, details: string): Order | null => {
      if (!checkoutProduct) return null;

      const { product, size } = checkoutProduct;
      const trackingId = `FF-TRK-${Math.floor(10000 + Math.random() * 90000)}-${user.role === 'shopper-a' ? 'A' : 'B'}`;
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

      const newOrder: Order = {
        id: orderId,
        trackingId,
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        price: product.price,
        size,
        paymentMethod: method,
        paymentDetails: details,
        status: 'Delivered', // Set as delivered so return can be tested immediately, or express dispatched
        createdAt: Date.now(),
        hubLocation: product.hubLocation || user.hub || 'Hub #4 - Central District',
        userRole: user.role,
        userPhone: user.phone,
        canReturn: true,
        rfidTag: `RFID-${Math.floor(1000 + Math.random() * 9000)}-${product.batchCode || 'STD'}-${size}`
      };

      setOrders((prev) => [newOrder, ...prev]);
      setLatestOrder(newOrder);

      // Remove the lock
      if (activeLock) {
        setLocks((prev) => prev.filter((l) => l.id !== activeLock.id));
        setActiveLock(null);
      }

      setIsCheckoutOpen(false);
      setIsWhatsAppOpen(true); // Open simulated WhatsApp notification drawer

      addEvent({
        user: user.name,
        action: 'CHECKOUT_SUCCESS',
        details: `Payment confirmed via ${method.toUpperCase()} (₹${product.price}) for ${product.title}. Tracking: ${trackingId}`,
        status: 'success',
      });

      addToast(`Order Confirmed! WhatsApp receipt generated.`, 'success');
      return newOrder;
    },
    [checkoutProduct, user, activeLock, addEvent, addToast]
  );

  // Return Tag Scan & Verification (Shopper)
  const openReturnModal = useCallback((order: Order) => {
    setOrderToReturn(order);
    setIsReturnModalOpen(true);
  }, []);

  const submitReturnScan = useCallback(
    (orderId: string, rfidTag: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const hubTarget = order.hubLocation || 'Hub #4 - Central District';

      // Update order status
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: 'Return Requested',
              tagScanVerified: true,
              canReturn: false,
            };
          }
          return o;
        })
      );

      // Create return request for merchant
      const newReturn: ReturnRequest = {
        id: `ret-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        orderId,
        productId: order.productId,
        productTitle: order.productTitle,
        productImage: order.productImage,
        size: order.size,
        price: order.price,
        shopperId: user.name,
        hubLocation: hubTarget,
        rfidTag: rfidTag || order.rfidTag || `RFID-SCAN-VERIFIED`,
        condition: 'Mint / Unworn (Verified Tag Attached)',
        status: 'scanned_and_routed',
        timestamp: Date.now(),
      };

      setReturns((prev) => [newReturn, ...prev]);

      addEvent({
        user: user.name,
        action: 'RETURN_SCAN',
        details: `RFID Tag Verified [${newReturn.rfidTag}]. Routed to ${hubTarget}. Awaiting Merchant Approval.`,
        status: 'urgent',
      });

      addToast(`Tag scanned & verified! Routed to ${hubTarget}.`, 'success');
      setIsReturnModalOpen(false);
    },
    [orders, user, addEvent, addToast]
  );

  // Merchant Approves Return -> Publishes directly to Local Vault with 10% discount!
  const merchantApproveReturn = useCallback(
    (returnId: string) => {
      const ret = returns.find((r) => r.id === returnId);
      if (!ret) return;

      const discountedPrice = Math.round(ret.price * 0.9); // 10% off

      // Create or update in products
      const newVaultProduct: Product = {
        id: `vault-ret-${Date.now()}`,
        title: `${ret.productTitle} [LOCAL VAULT]`,
        brand: 'VERIFIED LOCAL VAULT',
        category: 't-shirts', // fallback or lookup
        price: discountedPrice,
        originalPrice: ret.price,
        stockCount: 1,
        initialStock: 1,
        status: 'local-vault',
        discount: 10,
        hubLocation: ret.hubLocation,
        expressDelivery: true,
        image: ret.productImage,
        gallery: [ret.productImage],
        countdownSeconds: 86400,
        dropEndTime: Date.now() + 86400 * 1000,
        description: `Inspected and tag-verified local return from ${ret.shopperId}. Restocked at ${ret.hubLocation}. 10% Local Hub Discount with 24h express dispatch.`,
        details: [
          'At Local Vendor Near You • Express 24h Delivery',
          '10% Local Hub Discount',
          'Authenticated by Hub Inspector',
          `Size: ${ret.size}`
        ],
        modelType: 'apparel',
        availableSizes: [ret.size],
        batchCode: ret.rfidTag,
      };

      setProducts((prev) => [newVaultProduct, ...prev]);

      // Update return state
      setReturns((prev) =>
        prev.map((r) => (r.id === returnId ? { ...r, status: 'merchant_approved' } : r))
      );

      // Update corresponding order status
      setOrders((prev) =>
        prev.map((o) => (o.id === ret.orderId ? { ...o, status: 'Returned to Vault' } : o))
      );

      addEvent({
        user: 'Merchant Ops',
        action: 'VAULT_PUBLISHED',
        details: `Approved & Restocked to Local Vault: ${ret.productTitle} (10% off at ${ret.hubLocation})`,
        status: 'success',
      });

      addToast(`Item published to Local Vault at 10% discount!`, 'success');
    },
    [returns, addEvent, addToast]
  );

  // 3D Fit calculation engine
  const calculateFitMatch = useCallback(
    (product: Product, size: string, dimensions: FitDimensions): FitCalculationResult => {
      // Base sizing matrix
      const sizeIndex = ['S', 'M', 'L', 'XL', 'XXL'].indexOf(size.toUpperCase());
      const standardChest = 92 + (sizeIndex === -1 ? 2 : sizeIndex) * 6; // S=92, M=98, L=104, XL=110, XXL=116
      const standardWaist = 74 + (sizeIndex === -1 ? 2 : sizeIndex) * 5; // S=74, M=79, L=84, XL=89, XXL=94

      if (product.modelType === 'sneaker') {
        const shoeSizeNum = parseFloat(size.replace(/[^0-9.]/g, '')) || 9;
        const targetFootLength = 22 + shoeSizeNum * 0.65;
        const diff = Math.abs((dimensions.footLength || 27.5) - targetFootLength);
        const score = Math.max(72, Math.min(99, Math.round(100 - diff * 12)));

        if (diff < 0.5) {
          return {
            score,
            verdict: 'ideal',
            verdictText: `${score}% Match — True to Size`,
            tensionColor: 'green',
            tensionZones: { chestTension: 0.5, waistTension: 0.5, shouldersTension: 0.5 },
          };
        } else if ((dimensions.footLength || 27.5) > targetFootLength) {
          return {
            score,
            verdict: 'tight',
            verdictText: `${score}% Match — Snug Toe Box (Consider +0.5)`,
            tensionColor: 'red',
            tensionZones: { chestTension: 0.85, waistTension: 0.8, shouldersTension: 0.9 },
          };
        } else {
          return {
            score,
            verdict: 'relaxed',
            verdictText: `${score}% Match — Generous Room`,
            tensionColor: 'blue',
            tensionZones: { chestTension: 0.25, waistTension: 0.3, shouldersTension: 0.2 },
          };
        }
      }

      // Apparel tension
      const chestDelta = dimensions.chest - standardChest;
      const waistDelta = dimensions.waist - standardWaist;
      const totalDelta = Math.abs(chestDelta) + Math.abs(waistDelta);
      const score = Math.max(68, Math.min(98, Math.round(100 - totalDelta * 1.8)));

      const chestTension = Math.max(0.1, Math.min(1.0, 0.5 + chestDelta * 0.04));
      const waistTension = Math.max(0.1, Math.min(1.0, 0.5 + waistDelta * 0.04));

      if (totalDelta <= 4) {
        return {
          score,
          verdict: 'ideal',
          verdictText: `${score}% Match — Ideal Boxy Fit`,
          tensionColor: 'green',
          tensionZones: { chestTension, waistTension, shouldersTension: 0.5 },
        };
      } else if (chestDelta > 4 || waistDelta > 4) {
        return {
          score,
          verdict: 'tight',
          verdictText: `${score}% Match — Form-Fitting / Tight Zone`,
          tensionColor: 'red',
          tensionZones: { chestTension, waistTension, shouldersTension: 0.85 },
        };
      } else {
        return {
          score,
          verdict: 'relaxed',
          verdictText: `${score}% Match — Relaxed Oversized Drape`,
          tensionColor: 'blue',
          tensionZones: { chestTension, waistTension, shouldersTension: 0.25 },
        };
      }
    },
    []
  );

  const openFitStudio = useCallback((product: Product) => {
    setSelectedFitProduct(product);
    setIsFitStudioOpen(true);
  }, []);

  // Join waitlist
  const joinWaitlist = useCallback(
    (productId: string) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              waitlistCount: (p.waitlistCount || 0) + 1,
            };
          }
          return p;
        })
      );
      addEvent({
        user: user.name,
        action: 'WAITLIST_JOIN',
        details: `Subscribed to priority restock notification.`,
        status: 'info',
      });
      addToast(`Joined Waitlist! You will be notified via SMS/WhatsApp first.`, 'success');
    },
    [user, addEvent, addToast]
  );

  // Merchant Product Controls
  const updateProductStock = useCallback(
    (productId: string, newStock: number) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              stockCount: Math.max(0, newStock),
              status: newStock === 0 ? 'sold-out' : p.status === 'sold-out' ? 'live' : p.status,
            };
          }
          return p;
        })
      );
      addToast(`Inventory updated to ${newStock} units`, 'info');
    },
    [addToast]
  );

  const triggerFlashDrop = useCallback(
    (productId: string, minutes: number) => {
      const seconds = minutes * 60;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              status: 'live',
              countdownSeconds: seconds,
              dropEndTime: Date.now() + seconds * 1000,
            };
          }
          return p;
        })
      );
      addToast(`Triggered ${minutes}m Flash Drop Countdown!`, 'success');
      addEvent({
        user: 'Merchant Ops',
        action: 'LOCK_STOCK',
        details: `Flash Drop countdown armed (${minutes} mins remaining).`,
        status: 'urgent',
      });
    },
    [addToast, addEvent]
  );

  const addNewProduct = useCallback(
    (newP: Omit<Product, 'id'>) => {
      const product: Product = {
        ...newP,
        id: `ff-custom-${Date.now()}`,
      };
      setProducts((prev) => [product, ...prev]);
      addToast(`New drop "${product.title}" created!`, 'success');
    },
    [addToast]
  );

  // Live Traffic Simulator Engine
  const toggleTrafficSimulator = useCallback(() => {
    setTrafficSimulatorRunning((prev) => {
      const next = !prev;
      addToast(
        next ? 'High-Concurrency Traffic Simulator STARTED' : 'Traffic Simulator STOPPED',
        next ? 'success' : 'warn'
      );
      addEvent({
        user: 'TRAFFIC_ENGINE',
        action: 'LOCK_STOCK',
        details: next
          ? 'Spawning simulated concurrent shoppers (500–1200 req/sec profile)...'
          : 'Simulation halted. Workers returned to standby.',
        status: next ? 'urgent' : 'info',
      });
      return next;
    });
  }, [addToast, addEvent]);

  // Traffic Simulator Worker
  const simulatorRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trafficSimulatorRunning) {
      if (simulatorRef.current) clearInterval(simulatorRef.current);
      return;
    }

    simulatorRef.current = setInterval(() => {
      const simulatedShoppers = [
        'HypeBeast_99',
        'TokyoRider_X',
        'SeoulDrip_01',
        'BerlinCyber_4',
        'VibeCheck_88',
        'NeoSamurai_7',
        'ArchivalCollector',
        'D2CSpeed_55'
      ];
      const randomShopper = simulatedShoppers[Math.floor(Math.random() * simulatedShoppers.length)];

      // Pick an action type:
      // 0: Lock an item
      // 1: Checkout an active lock
      // 2: Join waitlist
      const actionRoll = Math.random();

      setProducts((currentProducts) => {
        const availableItems = currentProducts.filter((p) => p.status === 'live' && p.stockCount > 0);
        const soldOutItems = currentProducts.filter((p) => p.status === 'sold-out');

        if (actionRoll < 0.55 && availableItems.length > 0) {
          // Lock stock
          const item = availableItems[Math.floor(Math.random() * availableItems.length)];
          const size = item.availableSizes[Math.floor(Math.random() * item.availableSizes.length)];

          const simLock: StockLock = {
            id: `sim-lock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            productId: item.id,
            productTitle: item.title,
            productImage: item.image,
            price: item.price,
            size,
            userId: `sim-${Math.random().toString(36).substring(2, 6)}`,
            userName: randomShopper,
            lockedAt: Date.now(),
            expiresAt: Date.now() + 600 * 1000,
            remainingSeconds: 600,
          };

          setLocks((l) => [...l, simLock]);

          addEvent({
            user: randomShopper,
            action: 'LOCK_STOCK',
            details: `Atomic Lock placed on ${item.title} [Size ${size}]. Inventory reserved.`,
            status: 'info',
          });

          return currentProducts.map((p) => {
            if (p.id === item.id) {
              const newCount = Math.max(0, p.stockCount - 1);
              return {
                ...p,
                stockCount: newCount,
                status: newCount === 0 ? 'sold-out' : p.status,
              };
            }
            return p;
          });
        } else if (actionRoll < 0.85) {
          // Complete a checkout from existing locks or direct
          setLocks((currentLocks) => {
            const simLocks = currentLocks.filter((l) => l.userId.startsWith('sim-'));
            if (simLocks.length > 0) {
              const target = simLocks[0];
              const simOrder: Order = {
                id: `ORD-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
                trackingId: `FF-SIM-${Math.floor(10000 + Math.random() * 90000)}`,
                productId: target.productId,
                productTitle: target.productTitle,
                productImage: target.productImage,
                price: target.price,
                size: target.size,
                paymentMethod: Math.random() > 0.5 ? 'upi' : 'card',
                paymentDetails: 'Simulated Gateway 200 OK',
                status: 'Confirmed',
                createdAt: Date.now(),
                hubLocation: 'Hub #4 - Central District',
                userRole: 'shopper-a',
                userPhone: '+1 555-0199',
                canReturn: true,
              };

              setOrders((prev) => [simOrder, ...prev]);

              addEvent({
                user: target.userName,
                action: 'CHECKOUT_SUCCESS',
                details: `Simulated Checkout Complete: $${target.price} paid for ${target.productTitle}.`,
                status: 'success',
              });

              return currentLocks.filter((l) => l.id !== target.id);
            }
            return currentLocks;
          });
          return currentProducts;
        } else if (soldOutItems.length > 0) {
          // Join waitlist
          const target = soldOutItems[Math.floor(Math.random() * soldOutItems.length)];
          addEvent({
            user: randomShopper,
            action: 'WAITLIST_JOIN',
            details: `Joined waitlist for ${target.title}. Backorder queue incremented.`,
            status: 'warn',
          });
          return currentProducts.map((p) =>
            p.id === target.id ? { ...p, waitlistCount: (p.waitlistCount || 0) + 1 } : p
          );
        }
        return currentProducts;
      });
    }, 3800);

    return () => {
      if (simulatorRef.current) clearInterval(simulatorRef.current);
    };
  }, [trafficSimulatorRunning, addEvent]);

  // Telemetry KPIs
  const stats = {
    activeLocksCount: locks.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.price, 0),
    conversionRate: Math.min(
      94,
      Math.round((orders.length / Math.max(1, orders.length + locks.length * 0.4)) * 100)
    ),
    vaultItemsCount: products.filter((p) => p.status === 'local-vault').length,
    soldOutCount: products.filter((p) => p.status === 'sold-out').length,
  };

  return (
    <AppContext.Provider
      value={{
        user,
        switchUserRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        products,
        setProducts,
        updateProductStock,
        triggerFlashDrop,
        addNewProduct,
        joinWaitlist,
        activeLock,
        locks,
        lockStock,
        releaseLock,
        orders,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutProduct,
        setCheckoutProduct,
        completeCheckout,
        latestOrder,
        setLatestOrder,
        isWhatsAppOpen,
        setIsWhatsAppOpen,
        isFitStudioOpen,
        setIsFitStudioOpen,
        selectedFitProduct,
        openFitStudio,
        userDimensions,
        setUserDimensions,
        calculateFitMatch,
        returns,
        isReturnModalOpen,
        setIsReturnModalOpen,
        orderToReturn,
        openReturnModal,
        submitReturnScan,
        merchantApproveReturn,
        trafficSimulatorRunning,
        toggleTrafficSimulator,
        events,
        clearEvents: () => setEvents([]),
        stats,
        toasts,
        addToast,
        removeToast,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

