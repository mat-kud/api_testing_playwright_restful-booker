import { faker } from '@faker-js/faker/locale/en';
import { Booking } from 'utils/BookingInterface'

export const randomBooking: Booking =  {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.helpers.rangeToNumber({ min: 100, max: 1000 }),
    depositpaid: true,
    bookingdates: {
      checkin: new Date(faker.date.between({ from: '2025-01-01', to: '2025-06-30' })).toISOString().slice(0,10),
      checkout: new Date(faker.date.between({ from: '2025-07-01', to: '2025-12-31' })).toISOString().slice(0,10)
    },
    additionalneeds: "Dinner",
}

export function generateRandomBooking() : Booking{
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.helpers.rangeToNumber({ min: 100, max: 1000 }),
    depositpaid: true,
    bookingdates: {
      checkin: new Date(faker.date.between({ from: '2025-01-01', to: '2025-06-30' })).toISOString().slice(0,10),
      checkout: new Date(faker.date.between({ from: '2025-07-01', to: '2025-12-31' })).toISOString().slice(0,10)
    },
    additionalneeds: "Dinner",
}
}


export function generateRandomBookings(number : number) : Booking[] {
  let bookings = [];
  for(let i = 0; i < number; i++){
    bookings.fill(randomBooking);
  }
  return bookings;
}

//export const randomBooking: Booking = generateRandomBooking();


