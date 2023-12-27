export interface CouponCode {
  couponCode: any
  _id: string;
  name: string;
  code: string;
  start_date: {
    year: number;
    month: number;
  };
  end_date: {
    year: number;
    month: number;
  };
  free_shipping: boolean;
  quantity: number;
  discount_type: string;
  status: boolean;
  category: string[];
  min: number;
  max: number;
  shopId: string;
  products: string[];
  limit: number;
  customer: number;
  value: number;
  createdAt: Date;
}
