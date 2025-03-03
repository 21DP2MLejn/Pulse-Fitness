export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'Equipment' | 'Supplements' | 'Apparel' | 'Accessories';
  rating: number;
  reviews: Review[];
  stock: number;
  features: string[];
  specifications?: { [key: string]: string };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
