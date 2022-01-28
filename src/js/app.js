import {settings, select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {

  initMenu: function(){
    const thisApp = this;
      
    // console.log('thisApp.data:', thisApp.data);

    for(let productData in thisApp.data.products){
      // new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
    // const testProduct = new Product();
    // console.log('testProduct:', testProduct);
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.products;    // http://localhost:3131/products

    fetch(url)                          // Połącz się z adresem url przy użyciu metody fetch
      .then(function(rawResponse){      // Jeśli połączenie się zakończy, (.then) skonwertuj dane do obiektu JS-owego
        return rawResponse.json();      // Kiedy i ta operacja się zakończy, (.then) pokaż w konsoli te skonwertowane dane.
      })
      .then(function(parsedResponse){
        // console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();

      });
    // console.log('thisApp.data', JSON.stringify(thisApp.data));

  },

  init: function(){
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);

    thisApp.initData();
    // thisApp.initMenu();
    thisApp.initCart();

  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });

  },
};
app.init();
