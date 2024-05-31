import { faker } from '@faker-js/faker/locale/en';
import { Booking } from 'utils/BookingInterface';
import { parseBookingJSONToXML } from 'utils/JSONToXMLComverter';

export function updateBookingTotalPrice(randomBooking : Booking, totalPrice : number) : Booking{
    randomBooking.totalprice = totalPrice;
    return randomBooking;
}

export function updateBookingCheckoutDate(randomBooking : Booking, checkoutDate : string) : Booking{
    randomBooking.bookingdates.checkout = checkoutDate;
    return randomBooking;
}

export function updateBookingAdditionalNeeds(randomBooking : Booking, additionalneeds: string) : Booking{
    randomBooking.bookingdates.checkout = additionalneeds;
    return randomBooking;
}