export interface Category {
  category: Subcategory;
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
  images?: Images;
  rating?: number;
  subcategories?: Subcategory[];
  showMegaMenu: boolean;
  isShow?: boolean;
}

export interface Categories {
  categories?: Category[];

}

export interface Images {
  _id?: number;
  public_id?: number;
  url?: string;
  length: number;
}

export interface Subcategory {
  _id?: number;
  name?: string;
  description?: string;
  images?: Images[];
  subcategories?: Subcategory[];
  showMegaMenu: boolean;
}
export interface CategoryDetails {
  description: string;
  imageUrl: string;
}