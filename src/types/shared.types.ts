
export interface UserPayload {
  uid: string;
  email: string;
  role: 'admin' | 'viewer';
}


export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}


export interface AddProductPayload extends Omit<Product, 'id'> {}


export type UpdateProductPayload = Partial<AddProductPayload>;