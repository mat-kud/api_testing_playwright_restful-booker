import { faker } from '@faker-js/faker/locale/en';
import { Booking } from 'utils/BookingInterface';
import { parseBookingJSONToXML } from 'utils/JSONToXMLComverter';

export function createBookingEmptyLastName(randomBooking : Booking) : Booking{
    randomBooking.lastname = "";
    return randomBooking;
}

export function createBookingLogicSentenceAsLastName(randomBooking : Booking) : Booking{
    randomBooking.lastname = "Brown; DROP TABLE users;--";
    return randomBooking;
}

export function createBookingNoLastName(randomBooking : Booking) : Booking{
    delete randomBooking.lastname
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

export function createBookingNegativeTotalPrice(randomBooking : Booking) : Booking{
    randomBooking.totalprice = faker.helpers.rangeToNumber({ min: -10000, max: -100 });
    return randomBooking;
}

export function createBookingXMLFormat(randomBooking : Booking) : string{
    return parseBookingJSONToXML(randomBooking);
}