import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {

  initBooking: function(){
    const thisApp = this;

    const element = document.querySelector(select.containerOf.booking);
    thisApp.bookingWidget = new Booking(element);
  },

  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    // console.log('idFromHash:', idFromHash);

    // thisApp.activatePage(thisApp.pages[0].id);
    // thisApp.activatePage(idFromHash);

    // let pageMatchingHash = false;
    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
    // console.log('pageMatchingHash:', pageMatchingHash);

    thisApp.activatePage(idFromHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        // get page id from href getAttribute
        const id = clickedElement.getAttribute('href').replace('#', '');

        // run thisApp.activatePage with that id
        thisApp.activatePage(id);

        // change URL hash
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    // add class "active" to matching pages, remove from non-matching
    for(let page of thisApp.pages){
      // if(page.id == pageId){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    // add class "active" to matching links, remove from non-matching
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

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
    thisApp.initPages();
    thisApp.initBooking();
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
