import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';

import { ProductList } from '../productList/productList';
import { SearchTags } from '../searchTags/searchTags';

class Homepage extends Component {
  popularProducts: ProductList;
  searchTags: SearchTags;

  constructor(props: any) {
    super(props);

    this.searchTags = new SearchTags()
    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);
    this.searchTags.attach(this.view.searchTags)
  }

  render() {
    this.searchTags.update(['чехол iphone 13 pro', 'коляски agex', 'яндекс станция 2']);
    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.popularProducts.update(products);
      });

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  }
}

export const homepageComp = new Homepage(html);
