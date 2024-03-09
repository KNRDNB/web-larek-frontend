import {
	IAppState,
	IProduct,
	IProductItem,
	CART_ITEM_STATUS,
	IOrder,
	FormErrors,
	IOrderForm,
	PAYMENT_METHOD,
} from '../types';
import { IEvents } from './base/events';

export class ProductItem<T> implements IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	cartStatus: number;

	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
		this.cartStatus = 0;
		if (this.price === null) {
			this.cartStatus = CART_ITEM_STATUS.NO_PRICE;
		}
	}
}

export class AppData<T> implements IAppState {
	catalog: IProduct[];
	cart: string[];
	cardId: string;
	order: IOrder = {
		payment: PAYMENT_METHOD.ONLINE,
		address: '',
		email: '',
		phone: '',
        total: 0,
		items: [],
	};
	formErrors: FormErrors = {};

	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
		this.cart = [];
		this.order.payment = PAYMENT_METHOD.ONLINE;
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.events.emit('catalog:updated', { catalog: this.catalog });
	}
	
	getCatalog() {
		return this.catalog;
	}

	updateCatalog(id: string, action: string) {
		this.catalog.filter((item) => {
			this.cart.forEach(() => {
				if (item.id === id) {
					if (action === 'add') {
						item.cartStatus = CART_ITEM_STATUS.IN_CART;
					}
					if (action === 'delete') {
						item.cartStatus = CART_ITEM_STATUS.NOT_IN_CART;
					}
				}
			});
		});
		this.events.emit('catalog:updated', { catalog: this.catalog });
	}

	setActiveCardId(item: ProductItem<T>, action: string) {
		this.cardId = item.id;
		if (action === 'open') {
			this.events.emit('cardModal:open', item);
		}
		if (action === 'delete') {
			this.events.emit('cartItem:delete');
		}
	}

	getActiveCardId() {
		return this.cardId;
	}

	addToCart(id: string) {
		this.cart.push(id);
		this.updateCatalog(id, 'add');
		this.setOrderCart();
		this.events.emit('cart:updated');
	}

	deleteFromCart(id: string) {
		this.updateCatalog(id, 'delete');
		this.cart = this.cart.filter((item) => item !== id);
		this.setOrderCart();
		this.events.emit('cart:updated');
	}

	clearCart() {
        this.cart.forEach((id) =>{
            this.deleteFromCart(id);
        })
    }

	getTotal() {
		let cartTotal: number = 0;
		this.catalog.filter((item) => {
			this.cart.forEach((id) => {
				if (item.id === id) {
					cartTotal += item.price;
				}
			});
		});
		return cartTotal;
	}

	getCartProductList() {
		const cartProductList: Array<IProductItem> = [];
		this.catalog.filter((item) => {
			this.cart.forEach((id) => {
				if (item.id === id) {
					cartProductList.push(item);
				}
			});
		});
		return cartProductList;
	}

	getCartCount() {
		return this.cart.length;
	}

	setPaymentMethod(method: PAYMENT_METHOD) {
		this.order.payment = method;
	}

	getPaymentMethod() {
		return this.order.payment;
	}

	setOrderCart() {
		this.order.items = this.cart;
        this.setOrderTotal();
	}

    setOrderTotal(){
        this.order.total = this.getTotal();
    }

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
