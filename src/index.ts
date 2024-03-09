import './scss/styles.scss';
import { ShopAPI } from './components/ShopAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppData, ProductItem } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardModal } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { IProductItem, IOrderForm } from './types';
import { Cart, CartItem } from './components/Cart';
import { OrderStepContacts, OrderStepDetails } from './components/Form';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardModalTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cartItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppData({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const orderStepDetails = new OrderStepDetails(cloneTemplate(orderTemplate), events);
const orderStepContacts = new OrderStepContacts(cloneTemplate(contactsTemplate), events);

events.on('catalog:updated', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});
events.on('card:select', (item: ProductItem<IProductItem>) => {
	appData.setActiveCardId(item, 'open');
});

events.on('cardModal:open', (item: ProductItem<IProductItem>) => {
	const cardModal = new CardModal(cloneTemplate(cardModalTemplate),events,item.cartStatus);
	modal.render({
		content: cardModal.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			description: item.description,
		}),
	});
});

events.on('cart:updated', () => {
	let index = 0;
	page.counter = appData.getCartCount();
	cart.items = appData.getCartProductList().map((item) => {
		index += 1;
		const cartItem = new CartItem(cloneTemplate(cartItemTemplate), {
			onClick: () => events.emit('cartItem:select', item),
		});
		return cartItem.render({
			index: index,
			title: item.title,
			price: item.price,
		});
	});
	modal.close();
});
events.on('cartItem:select', (item: ProductItem<IProductItem>) => {
	appData.setActiveCardId(item, 'delete');
});

events.on('cart:open', () => {
	modal.render({
		content: cart.render({
			total: appData.getTotal(),
			length: appData.getCartCount(),
		}),
	});
});

events.on('cartItem:add', () => {
	const id = appData.getActiveCardId();
	appData.addToCart(id);
});

events.on('cartItem:delete', () => {
	const id = appData.getActiveCardId();
	appData.deleteFromCart(id);
});

events.on('details:open', () => {
	modal.render({
		content: orderStepDetails.render({
			payment: appData.getPaymentMethod(),
			address: '',
			valid: false,
			errors: [],
		}),
	});
});
events.on('details:submit', () => {
	modal.render({
		content: orderStepContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});
events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
        .then((result) => {
            appData.clearCart();
            const success = new Success(cloneTemplate(successTemplate), {onClick: () => modal.close()},);
            modal.render({
                content: success.render({
                    total: result.total
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
});

events.on('paymentMethod:change', (method) => {
	if (method) {
		appData.setPaymentMethod(Object.values(method)[0]);
	}
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, email, phone } = errors;
	orderStepDetails.valid = !address;
	orderStepContacts.valid = !email && !phone;
	orderStepDetails.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
	orderStepContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(/^details\.|^contacts\..*:change/,(data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
});

api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.error(error);
	});
