import { expect, test } from "playwright/test";
import { randomBooking } from "test-data/generateRandomBooking";
import { bookingURL } from "bookingEndpoints";
import * as postData from "test-data/postBookingData"
import { am } from "utils/AssertionMessages"

test('Create Booking With Valid Data @positive', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: randomBooking
  });

  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(2);
  expect.soft(Object.keys(responseBody.booking).length, am.bookingLength).toEqual(6);
  expect.soft(Object.keys(responseBody.booking.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody.bookingid, am.validId).toBeGreaterThan(0);
  expect.soft(responseBody.booking, am.responseBody).toEqual(randomBooking);
});

test('Create Booking With Valid Data Float Totaprice @positive', async ({ request }) => {
  const bookingFloatTotalprice = postData.createBookingFloatTotalprice(randomBooking);
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingFloatTotalprice(randomBooking)
  });

  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(2);
  expect.soft(Object.keys(responseBody.booking).length, am.bookingLength).toEqual(6);
  expect.soft(Object.keys(responseBody.booking.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody.bookingid, am.validId).toBeGreaterThan(0);
  expect.soft(responseBody.booking, am.responseBody).toEqual(bookingFloatTotalprice);
});

test('Create Booking With Valid Data Float Totaprice XML Payload @positive', async ({ request }) => {
  const bookingFloatTotalprice = postData.createBookingFloatTotalprice(randomBooking);
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingXMLFormat(bookingFloatTotalprice),
    headers: {
      "Content-Type": "text/xml"
    }
  });

  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(2);
  expect.soft(Object.keys(responseBody.booking).length, am.bookingLength).toEqual(6);
  expect.soft(Object.keys(responseBody.booking.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody.bookingid, am.validId).toBeGreaterThan(0);
  expect.soft(responseBody.booking, am.responseBody).toEqual(bookingFloatTotalprice);
});

test('Create Booking Empty Payload @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: ""
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Empty Firstname @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingEmptyFirstname(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Special Characters Firstname @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingSpecialCharactersFirstname(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Number Lastname @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingNumberLastname(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With String Depositpaid Lastname @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingStringDepositpaid(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With No Bookingdates @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingNoBookingdates(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Empty Checkin @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingEmptyCheckin(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Incorrect Checkout Date Format @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingWrongCheckoutFormat(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking By Swapping Checkin and Checkout Position @negative', async ({ request }) => {
  const bookingSwappedCheckinCheckout = postData.createBookingSwapCheckinCheckoutPositions(randomBooking);
  const response = await request.post(`${bookingURL}`, {
    data: bookingSwappedCheckinCheckout
  });

  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(2);
  expect.soft(Object.keys(responseBody.booking).length, am.bookingLength).toEqual(6);
  expect.soft(Object.keys(responseBody.booking.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody.bookingid, am.validId).toBeGreaterThan(0);
  expect.soft(responseBody.booking, am.responseBody).toEqual(bookingSwappedCheckinCheckout);
});

test('Create Booking With Checkin Later Than Checkout @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingCheckinLaterThanCheckout(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking The Same Day Checkin Checkout @positive', async ({ request }) => {
  const bookingSameDayCheckinCheckout = postData.createBookingSameDayCheckinCheckout(randomBooking);
  const response = await request.post(`${bookingURL}`, {
    data: bookingSameDayCheckinCheckout
  });

  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(2);
  expect.soft(Object.keys(responseBody.booking).length, am.bookingLength).toEqual(6);
  expect.soft(Object.keys(responseBody.booking.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody.bookingid, am.validId).toBeGreaterThan(0);
  expect.soft(responseBody.booking, am.responseBody).toEqual(bookingSameDayCheckinCheckout);
});

test('Create Booking With Array Lastname @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingArrayLastname(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Negative Totalprice @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingNegativeTotalprice(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Application/JSON Content-Type Header And XML Payload @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: postData.createBookingXMLFormat(randomBooking)
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Text/XML Content-Type Header And JSON Payload @negative', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: randomBooking,
    headers: {
      "Content-Type": "text/xml"
    }
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Create Booking With Booking Data Already Created @negative', async ({ request }) => {
  const booking = randomBooking;
  await request.post(`${bookingURL}`, {
    data: booking
  });

  const response = await request.post(`${bookingURL}`, {
    data: booking
  });

  expect.soft(response.status(), am.status).toBe(400);
});
