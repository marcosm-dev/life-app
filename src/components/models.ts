export interface Category {
  id: string
  name: string
  urlImage: string | null
}
export interface User {
  id?: string
  name?: string
  lastName?: string
  VATIN?: string
  phone?: string
  address?: string
  zipCode?: string
  city?: string
  email: string
  password?: string
  confirmPassword?: string
  token?: string
  uuid?: string | null
}

export interface Product {
  id: string
  quantity: number
  name: string
  description: string
  price: number
  accessories: string
  urlMoreInfo: string
  stock: number
  brand: string
  uuid: string
  image: string
  userId: number
  categoryId: number
  amount: number
  cartUid?: string
}

export interface EmailData {
  [key: string]: unknown
  nombre: string
  email: string
}

export interface SignUpInput {
  name: string
  lastName: string
  VATIN: string
  phone: string
  address: string
  email: string
  role: string
  password: string
  access: boolean
}

export interface Root {
  data: SignUpData
}

export interface SignUpData {
  signUp: SignUp
}

export interface SignUp {
  token: string
  user: User
  error: string
}

export interface Orders {
  [yearMonth: string]: Order[]
}

export interface Order {
  id: string
  createdAt: string
  status: string
  products: Product[]
}

export interface Product {
  amount: number
  product: Product2
}

export interface Product2 {
  id: string
  name: string
  price: number
  accessories: string
}

export interface BeforeInstallPromptEvent extends Event {
  platforms: string[]
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export interface NotifyError {
  message: string
  html?: boolean
}
export interface Lines {
  document: string
  quantity: number
  tax: string[]
  text: string
  unitPrice: number
  account: string
}
