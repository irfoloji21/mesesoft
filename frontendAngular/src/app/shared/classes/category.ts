export interface Category {
  path?: string;
  title?: string;
  type?: string;
  megaMenu?: boolean;
  active?: boolean;
  badge?: boolean;
  badgeText?: string;
  createdAt?: Date;
  _id?: number;
  name?: string;
  description?: string;
  images?: Images[];
  rating?:number;
  subcategories?: Subcategory[];
}

export interface Categories {
  categories?: Category[];
}

export interface Images {
  _id?: number;
  public_id?: number;
  url?: string;
}

export interface Subcategory {
  _id?: number;
  name?: string;
  description?: string;
  images?: Images[];
}
