import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

// Available currencies with their symbols and formatting
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', position: 'before', decimals: 2 },
  EUR: { symbol: '€', name: 'Euro', position: 'before', decimals: 2 },
  GBP: { symbol: '£', name: 'British Pound', position: 'before', decimals: 2 },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka', position: 'before', decimals: 0 },
  INR: { symbol: '₹', name: 'Indian Rupee', position: 'before', decimals: 0 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', position: 'before', decimals: 2 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', position: 'before', decimals: 2 },
  JPY: { symbol: '¥', name: 'Japanese Yen', position: 'before', decimals: 0 },
  CNY: { symbol: '¥', name: 'Chinese Yuan', position: 'before', decimals: 2 },
  KRW: { symbol: '₩', name: 'South Korean Won', position: 'before', decimals: 0 },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', position: 'before', decimals: 2 },
  SAR: { symbol: '﷼', name: 'Saudi Riyal', position: 'before', decimals: 2 },
  PKR: { symbol: '₨', name: 'Pakistani Rupee', position: 'before', decimals: 0 },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', position: 'before', decimals: 2 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', position: 'before', decimals: 2 },
  THB: { symbol: '฿', name: 'Thai Baht', position: 'before', decimals: 0 },
  PHP: { symbol: '₱', name: 'Philippine Peso', position: 'before', decimals: 2 },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', position: 'before', decimals: 0 },
  VND: { symbol: '₫', name: 'Vietnamese Dong', position: 'after', decimals: 0 },
  NGN: { symbol: '₦', name: 'Nigerian Naira', position: 'before', decimals: 2 },
  ZAR: { symbol: 'R', name: 'South African Rand', position: 'before', decimals: 2 },
  BRL: { symbol: 'R$', name: 'Brazilian Real', position: 'before', decimals: 2 },
  MXN: { symbol: 'MX$', name: 'Mexican Peso', position: 'before', decimals: 2 },
};

const defaultSettings = {
  // Delivery Settings
  delivery: {
    freeDeliveryThreshold: 50,
    standardDeliveryPrice: 5.99,
    expressDeliveryPrice: 12.99,
    freeDeliveryEnabled: true,
  },
  // Tax Settings
  tax: {
    vatRate: 20, // percentage
    vatEnabled: true,
    vatIncludedInPrice: false,
  },
  // Store Settings
  store: {
    storeName: 'ShopEase',
    currency: 'USD',
    currencySymbol: '$',
    minOrderAmount: 10,
  },
  // Discount Settings
  discount: {
    globalDiscountEnabled: false,
    globalDiscountPercent: 0,
    promoCode: '',
    promoCodeDiscount: 10,
    promoCodeEnabled: false,
  },
  // Shipping Zones
  shippingZones: [
    { id: 1, name: 'Local', price: 3.99, minDays: 1, maxDays: 2 },
    { id: 2, name: 'National', price: 5.99, minDays: 3, maxDays: 5 },
    { id: 3, name: 'International', price: 15.99, minDays: 7, maxDays: 14 },
  ],
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('shopease_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('shopease_settings', JSON.stringify(settings));
  }, [settings]);

  // Update delivery settings
  const updateDeliverySettings = (deliverySettings) => {
    setSettings(prev => ({
      ...prev,
      delivery: { ...prev.delivery, ...deliverySettings }
    }));
  };

  // Update tax settings
  const updateTaxSettings = (taxSettings) => {
    setSettings(prev => ({
      ...prev,
      tax: { ...prev.tax, ...taxSettings }
    }));
  };

  // Update store settings
  const updateStoreSettings = (storeSettings) => {
    setSettings(prev => ({
      ...prev,
      store: { ...prev.store, ...storeSettings }
    }));
  };

  // Update discount settings
  const updateDiscountSettings = (discountSettings) => {
    setSettings(prev => ({
      ...prev,
      discount: { ...prev.discount, ...discountSettings }
    }));
  };

  // Update shipping zones
  const updateShippingZones = (zones) => {
    setSettings(prev => ({
      ...prev,
      shippingZones: zones
    }));
  };

  // Add shipping zone
  const addShippingZone = (zone) => {
    const newZone = {
      ...zone,
      id: Math.max(...settings.shippingZones.map(z => z.id), 0) + 1
    };
    setSettings(prev => ({
      ...prev,
      shippingZones: [...prev.shippingZones, newZone]
    }));
  };

  // Delete shipping zone
  const deleteShippingZone = (zoneId) => {
    setSettings(prev => ({
      ...prev,
      shippingZones: prev.shippingZones.filter(z => z.id !== zoneId)
    }));
  };

  // Calculate delivery price based on cart total
  const getDeliveryPrice = (cartTotal, zone = 'National') => {
    const { freeDeliveryEnabled, freeDeliveryThreshold } = settings.delivery;
    
    if (freeDeliveryEnabled && cartTotal >= freeDeliveryThreshold) {
      return 0;
    }
    
    const shippingZone = settings.shippingZones.find(z => z.name === zone);
    return shippingZone ? shippingZone.price : settings.delivery.standardDeliveryPrice;
  };

  // Calculate VAT amount
  const calculateVAT = (amount) => {
    if (!settings.tax.vatEnabled) return 0;
    return (amount * settings.tax.vatRate) / 100;
  };

  // Calculate total with VAT
  const getTotalWithVAT = (subtotal, deliveryPrice = 0) => {
    const vatAmount = calculateVAT(subtotal);
    return subtotal + vatAmount + deliveryPrice;
  };

  // Apply promo code
  const applyPromoCode = (code) => {
    const { promoCode, promoCodeEnabled, promoCodeDiscount } = settings.discount;
    if (promoCodeEnabled && code.toUpperCase() === promoCode.toUpperCase()) {
      return { valid: true, discount: promoCodeDiscount };
    }
    return { valid: false, discount: 0 };
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Format price with currency
  const formatPrice = (price) => {
    const currency = CURRENCIES[settings.store.currency] || CURRENCIES.USD;
    const formattedNumber = price.toLocaleString('en-US', {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    });
    
    if (currency.position === 'after') {
      return `${formattedNumber}${currency.symbol}`;
    }
    return `${currency.symbol}${formattedNumber}`;
  };

  // Change currency
  const changeCurrency = (currencyCode) => {
    const currency = CURRENCIES[currencyCode];
    if (currency) {
      updateStoreSettings({
        currency: currencyCode,
        currencySymbol: currency.symbol,
      });
    }
  };

  const value = {
    settings,
    CURRENCIES,
    updateDeliverySettings,
    updateTaxSettings,
    updateStoreSettings,
    updateDiscountSettings,
    updateShippingZones,
    addShippingZone,
    deleteShippingZone,
    getDeliveryPrice,
    calculateVAT,
    getTotalWithVAT,
    applyPromoCode,
    resetSettings,
    formatPrice,
    changeCurrency,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
