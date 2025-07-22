export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew?: boolean;
  discount?: number;
  rate: number;
}

export interface ProductData {
  products: Product[];
}
