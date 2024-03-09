export enum CART_ITEM_STATUS {
	NOT_IN_CART = 0,
	IN_CART = 1,
	NO_PRICE = 2,
}

export enum PAYMENT_METHOD {
	ONLINE = 'Онлайн',
	RECEIVED = 'При получении',
}

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICartStatus {
	cartStatus: CART_ITEM_STATUS;
}

export type IProduct = IProductItem & ICartStatus;

export interface IAppState {
	catalog: IProductItem[];
	cart: string[];
}

export interface IOrderForm {
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	payment: PAYMENT_METHOD;
	total: number;
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}
