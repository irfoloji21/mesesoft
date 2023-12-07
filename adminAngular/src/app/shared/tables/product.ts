export interface Product {
    createdAt: string | number | Date;
    id?: number;
    _id?:number;
    title?: string;
    name? : string;
    slug? : string;
    description?: string;
    type?: string;
    brand?: string;
    collection?: any[];
    category?: string;
    price?: number;
    sale?: boolean;
    discount?: number;
    stock?: number;
    new?: boolean;
    quantity?: number;
    tags?: any[];
    variants?: Variants[];
    images?: Images[];
    sold_out?: string;
    originalPrice?:number;
    discountPrice? : number;
    ratings?:any;
    reviews?:any;
    shop?:Shop;
    gender?:any;
    brands?:any;
    colors?:any;
    sizes?:any;
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
export interface Variants {
    variant_id?: number;
    id?: number;
    sku?: string;
    size?: string;
    color?: string;
    image_id?: number;
}

export interface Images {
    image_id?: number;
    id?: number;
    alt?: string;
    src?: string;
    variant_id?: any[];
    url?:string;
}