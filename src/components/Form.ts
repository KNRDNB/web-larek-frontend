import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from './../utils/utils';
import { IOrder, IOrderForm, PAYMENT_METHOD } from '../types';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this._submit = ensureElement<HTMLButtonElement>('button[type=submit]',this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

interface IOrdersActions {
    onClick: () => void;
}

export class OrderStepDetails extends Form<IOrder> {
	protected _onlineButton: HTMLButtonElement;
	protected _receivedButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._onlineButton = ensureElement<HTMLButtonElement>('button[name=card]',this.container);
		this._receivedButton = ensureElement<HTMLButtonElement>('button[name=cash]',this.container);
		this._onlineButton.addEventListener('click', () => {
			this._onlineButton.classList.add('button_alt-active');
			this._receivedButton.classList.remove('button_alt-active');
			events.emit('paymentMethod:change', [PAYMENT_METHOD.ONLINE]);
		});
		this._receivedButton.addEventListener('click', () => {
			this._receivedButton.classList.add('button_alt-active');
			this._onlineButton.classList.remove('button_alt-active');
			events.emit('paymentMethod:change', [PAYMENT_METHOD.RECEIVED]);
		});
	}

	set payment(value: string) {
		if (value === PAYMENT_METHOD.ONLINE) {
			this._onlineButton.classList.add('button_alt-active');
		}
		if (value === PAYMENT_METHOD.RECEIVED) {
			this._receivedButton.classList.add('button_alt-active');
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

export class OrderStepContacts extends Form<IOrderForm> {
    
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}