import {templates, select, settings} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import {utils} from '../utils.js';

class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.element = element;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    console.log('getData params', params);

    const urls = {
      booking:        settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event   + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event   + '?' + params.eventsRepeat.join('&'),
    };

    console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      }) 
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
      });

    // Promise.all([
    //   fetch(urls.booking),
    // ])
    //   .then(function(allResponses){
    //     const bookingsResponse = allResponses[0];
    //     return Promise.all([
    //       bookingsResponse.json(),
    //     ]);
    //   }) 
    //   .then(function([bookings]){
    //     console.log(bookings);
    //   });

    // fetch(urls.booking)
    //   .then(function(bookingResponse){
    //     return bookingResponse.json();
    //   })
    //   .then(function(booking){
    //     console.log('booking', booking);
    //   });

    // fetch(urls.eventsCurrent)
    //   .then(function(eventsCurrentResponse){
    //     return eventsCurrentResponse.json();
    //   })
    //   .then(function(eventsCurrent){
    //     console.log('eventsCurrent', eventsCurrent);
    //   });  
  }

  render(){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = thisBooking.element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.element.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    /*
    thisBooking.dom.peopleAmount.addEventListener('updated', function(){
    });
    thisBooking.dom.hoursAmount.addEventListener('updated', function(){
    });
    */

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.dom.datePicker.addEventListener('updated', function(){
    });
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.hourPicker.addEventListener('updated', function(){
    });
  }
}

export default Booking;