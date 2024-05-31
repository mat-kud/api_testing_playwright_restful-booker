import { faker } from '@faker-js/faker/locale/en';
import { Booking } from 'utils/BookingInterface';
import { parseBookingJSONToXML } from 'utils/JSONToXMLComverter';

export function createBookingFloatTotalprice(randomBooking : Booking){
    let newBooking : any = randomBooking;
    newBooking.totalprice = Number.parseFloat((Math.random() * (4000 - 1) + 1).toFixed(2));
    return newBooking;
}

export function createBookingEmptyFirstname(randomBooking : Booking) : Booking{
    randomBooking.firstname = "";
    return randomBooking;
}

export function createBookingSpecialCharactersFirstname(randomBooking : Booking) : Booking{
    randomBooking.firstname = "/?!;:[]<>+@";
    return randomBooking;
}

export function createBookingNumberLastname(randomBooking : Booking){
    let newBooking : any = randomBooking;
    newBooking.lastname = 95;
    return newBooking;
}

export function createBookingStringDepositpaid(randomBooking : Booking){
    let newBooking : any = randomBooking
    newBooking.depositpaid = "accepted";
    return newBooking;
}

export function createBookingNoBookingdates(randomBooking : Booking) : Booking{
    delete randomBooking.bookingdates;
    return randomBooking;
}

export function createBookingEmptyCheckin(randomBooking : Booking) : Booking{
    randomBooking.bookingdates.checkin = "";
    return randomBooking;
}

export function createBookingWrongCheckoutFormat(randomBooking : Booking) : Booking{
    const checkout : string = randomBooking.bookingdates.checkout;
    const checkoutWrongFormat : string = checkout.slice(8,10) + checkout.slice(4,8) + checkout.slice(0,4);
    randomBooking.bookingdates.checkout = checkoutWrongFormat;
    return randomBooking;
}

export function createBookingSwapCheckinCheckoutPositions(randomBooking : Booking) : Booking{
    const checkin : string = randomBooking.bookingdates.checkin;
    delete randomBooking.bookingdates.checkin;
    randomBooking.bookingdates.checkin = checkin;
    return randomBooking;
}

export function createBookingCheckinLaterThanCheckout(randomBooking : Booking) : Booking{
    const bookingdates = {
        checkin : new Date(faker.date.between({ from: '2025-07-01', to: '2025-12-31' })).toISOString().slice(0,10),
        checkout : new Date(faker.date.between({ from: '2025-01-01', to: '2025-06-30' })).toISOString().slice(0,10)
    };
    randomBooking.bookingdates = bookingdates;
    return randomBooking;
}

export function createBookingSameDayCheckinCheckout(randomBooking : Booking) : Booking {
    const date : string = new Date(faker.date.between({ from: '2025-07-01', to: '2025-12-31' })).toISOString().slice(0,10);
    const bookingdates = {
        checkin : date,
        checkout : date
    };
    randomBooking.bookingdates = bookingdates;
    return randomBooking; 
}

export function createBookingArrayLastname(randomBooking : Booking){
    let newBooking : any = randomBooking;
    newBooking.lastname = ["Adam", "Martin"];
    return newBooking;
}

export function createBookingNegativeTotalprice(randomBooking : Booking) : Booking{
    randomBooking.totalprice = faker.helpers.rangeToNumber({ min: -10000, max: -100 });
    return randomBooking;
}

export function createBookingAsJSONString(randomBooking : Booking) : string{
    return JSON.stringify(randomBooking);
}

export function createBookingXMLFormat(randomBooking : Booking) : string{
    return parseBookingJSONToXML(randomBooking);
}



