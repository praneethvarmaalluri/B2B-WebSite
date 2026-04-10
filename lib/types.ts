export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string | Category;
  description: string;
  price: number;
  discountPrice?: number | null;
  stockCount: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}