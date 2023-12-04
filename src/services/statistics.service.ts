import { formatPrice, genUUID } from "../utils/helpers";
import { ProductData } from "types";

type StatBody = {
    type: StatEventType,
    payload: object,
    timestamp: number
};

enum StatEventType {
    ROUTE = 'route',
    VIEW_CARD = 'viewCard',
    VIEW_CARD_PROMO = 'viewCardPromo',
    ADD_TO_CART = 'addToCart',
    PURCHASE = 'purchase',
}

class StatisticsService {
    // событие перехода по страницам
    onRoute(url: string, timestamp: number) {
        const action = {
            type: StatEventType.ROUTE,
            payload: { url },
            timestamp,
        }

        this._send(action);
    }

    // событие просмотра товара в списке товаров
    onViewProduct(product: ProductData, secretKey: string, timestamp: number) {
        const action = {
            type: this._isEmpty(product.log) ? StatEventType.VIEW_CARD : StatEventType.VIEW_CARD_PROMO,
            payload: { ...product, secretKey },
            timestamp,
        }

        this._send(action);
    }

    // событие добавление товара в корзину
    onAddToCart(product: ProductData, timestamp: number) {
        const action = {
            type: StatEventType.ADD_TO_CART,
            payload: { ...product },
            timestamp,
        }

        this._send(action);
    }

    // событие оформления заказа
    onOrder(products: ProductData[], timestamp: number) {
        const totalPrice = products.reduce((acc, product) => (acc += product.salePriceU), 0);
        const formattedTotalPrice = formatPrice(totalPrice);
        
        const action = {
            type: StatEventType.PURCHASE,
            payload: { 
                orderId: genUUID(),
                totalPrice: formattedTotalPrice,
                productIds: products.map(product => product.id),
            },
            timestamp,
        }

        return this._send(action);
    }

    // отправка статистики
    private async _send(data: StatBody) {
        console.log(data.payload)
        const eventDate = new Date(data.timestamp);
        console.log('Время создания события: ' + eventDate.toLocaleString())
        const currentDate = new Date();
        console.log('Время отправки: ' + currentDate.toLocaleString());

        return fetch('/api/sendEvent', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    private _isEmpty(field: any) {
        if (!field) return true;

        if (Array.isArray(field) || typeof field === 'string') {
            return field.length === 0;
        } else if (typeof field === 'object' && field !== null) {
            return Object.keys(field).length === 0;
        } else {
            return false;
        }
    }
}

export const statisticsService = new StatisticsService();