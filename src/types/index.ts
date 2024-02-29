export type PaymentMethod = 'online' | 'received';

export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null
}

export interface IAppState {
  catalog: IProductItem[];
  cart: string[];
}

export type ICartItem = Pick<IProductItem, 'id' | 'title' | 'price'>

export interface IOrderForm {
  method: PaymentMethod;
  adress: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
  items: string[]
}

export interface IOrderResult {
  id: string;
  total: number;
}