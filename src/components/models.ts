export interface Category {
  id: number
  name: string
  urlImage: string | null
}

export interface Product {
  quantity: number
  id: number
  name: string
  description: string
  price: number
  accesories: string
  urlMoreInfo: string
  stock: number
  urlImage: string
  userId: number
  categoryId: number
  amount: number
  uuid?: string
}

export interface EmailData {
  nombre: string
  email: string
}
