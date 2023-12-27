export interface Collection {
  id: number;
  name: string;
  productIds: [];
  images: Images[];
  savings: number;
  description: string;
  shopId: string;
  shop?: Shop;
  isShop?: boolean;
  isShow?: boolean;
}

export interface Images {
  _id?: number;
  public_id?: number;
  url?: string;
  length: number;
}

export interface Shop {
  address: string;
  availableBalance: number;
  avatar: {
    public_id: string;
    url: string;
  };
  createdAt: string;
  description: string;
  email: string;
  name: string;
  resetPasswordTime: string | null;
  resetPasswordToken: string | null;
  role: string;
}


