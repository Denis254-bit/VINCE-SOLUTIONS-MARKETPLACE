export interface Product {
  id: string;
  name: string;
  category: 'laptops' | 'desktops' | 'printers' | 'solutions';
  price: number;
  specs: string;
  image: string;
  description: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Available for Order';
  brand: string;
  customizableOptions?: {
    name: string;
    choices: { value: string; priceModifier: number }[];
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: { [optionName: string]: string };
}

export interface CheckoutInfo {
  name: string;
  email: string;
  phone: string;
  county: string;
  address: string;
  shippingMethod: 'standard' | 'express' | 'pickup';
  paymentMethod: 'mpesa' | 'bank' | 'stripe';
  mpesaCode?: string;
  stripePaymentId?: string;
}

export interface OrderState {
  items: CartItem[];
  info: CheckoutInfo;
  orderId: string;
  subtotal: number;
  vat: number;
  discount: number;
  shippingPrice: number;
  total: number;
  status: 'processing' | 'processing_payment' | 'shipped' | 'out_for_delivery' | 'delivered';
  couponUsed?: string;
  date: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

