# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

```
// Информация о продукте
interface IProductItem {
  id: string; // Идентификатор
  description: string; // Описание
  image: string; // эндпоинт картинки
  title: string; // Название
  category: string; // Категория
  price: number | null // Цена
}

// Приложение
interface IAppState {
  catalog: IProductItem[]; // Каталог товаров
  cart: string[]; // Корзина
}

type ICartItem = Pick<IProductItem, 'id' | 'title' | 'price'> // Товар в корзине
type PaymentMethod = 'online' | 'received'; // Способ оплаты

// Форма оплаты
interface IOrderForm {
  method: PaymentMethod; // Способ оплаты
  adress: string; // Адрес
  email: string; // Email
  phone: string; // Телефон
}

// Заказ
interface IOrder extends IOrderForm {
  items: string[] // Товары в заказе
}

// Сформированный заказ
interface IOrderResult {
  id: string; // Идентификатор заказа
  total: number; // Сумма заказа
}
```

## Базовый код

### 1. Класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы on, off, emit — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.

## Компоненты модели данных

### 1. Класс AppData

Управляет приложением.

Класс имеет методы:
setCatalog - Собирает каталог.

### 2. Класс Cart

Управляет корзиной.

Класс имеет методы:
addToCart - Добавляет товар в корзину.
deleteFromCart - Удаляет товар из корзины.
clearCart - Очищает корзину.
getTotal - Считает сумму всех товаров в корзине.
getProductList - Получает список товаров в корзине.
updateProductList - Обновляет список товаров в корзине.

### 3. Класс Order

Позволяет управлять заказом.

Класс имеет методы:
clearData - Очищает поля формы.
validateData - Валидирует поля формы.

### 4. Класс ShopApi

Позволяет взаимодействовать с сервером.

Класс имеет методы:
getProductList - Получает список товаров с сервера.
getProduct - Получает товар с сервера.
orderProducts - Передает заказ серверу.

## Компоненты представления

### 1. Класс Modal

Отображает модальные окна.

Класс имеет методы:

open - Открыть модальное окно.
close - Закрыть модальное окно.

### 2. Класс Card

Отображает карточку товара.
При клике по карточке генерируется эвент cardModal:open

### 3. Класс Cart

Отображает корзину.
При клике по корзине генерируется эвент cartModal:open

### 4. Класс Form

Отображает форму оформления заказа.

### 5. Класс Succsess

Отображает подтверждение заказа.

### 6. Класс Page

Отображает каталог товаров на странице.