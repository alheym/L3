import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-favorites';

class FavoriteService {
  init() {
    this._updCounters();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB, data);
    this._updCounters();
  }

  async isInFavorite(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;


    // проверка типов на соответствие HTMLElement
    document.querySelectorAll('.js__favorites-counter').forEach(($el: Element) => {
        if ($el instanceof HTMLElement) {
            $el.innerText = String(count || '');
        }
    });
    
    const headerButton = document.querySelector('.header__buttons .favorites');
    if (headerButton instanceof HTMLElement) {
        headerButton.classList.toggle('hide', products.length === 0);
    }
  }
}

export const favoriteService = new FavoriteService();