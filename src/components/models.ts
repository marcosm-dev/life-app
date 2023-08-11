import { NewUser } from 'src/stores/auth';
export interface Category {
  id: string;
  name: string;
  urlImage: string | null;
}

export interface Product {
  id: string;
  quantity: number;
  name: string;
  description: string;
  price: number;
  accesories: string;
  urlMoreInfo: string;
  stock: number;
  uuid: string;
  urlImage: string;
  userId: number;
  categoryId: number;
  amount: number;
  cartUid?: string;
}

export interface EmailData {
  [key: string]: unknown;
  nombre: string;
  email: string;
}

export interface SignUpInput {
  name: string;
  lastName: string;
  VATIN: string;
  phone: string;
  address: string;
  email: string;
  role: string;
  password: string;
  access: boolean;
}

export interface Root {
  data: SignUpData;
}

export interface SignUpData {
  signUp: SignUp;
}

export interface SignUp {
  token: string;
  user: NewUser;
  error: string;
}
