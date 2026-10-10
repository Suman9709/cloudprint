export type Shop = {
  id: number;
  name: string;
  slug: string;
  address: string;
  is_accepting_orders: boolean;
  owner_name: string;
  owner_email: string;
  public_url: string;
};

export type ShopEarnings = {
  shop_id: number;
  shop_name: string;
  shop_slug: string;
  is_active: boolean;
  owner_name: string;
  total_orders: number;
  paid_orders: number;
  shop_earnings: string;
  platform_earnings: string;
  customer_payments: string;
};

export type EarningsReport = {
  summary: {
    shops: number;
    paid_orders: number;
    shop_earnings: string;
    platform_earnings: string;
    customer_payments: string;
  };
  shops: ShopEarnings[];
};

export const money = (amount: number | string) => `₹${Number(amount).toFixed(2)}`;
