import { expect, test } from "playwright/test";
import { randomBooking } from "test-data/generateRandomBooking";
import { bookingURL } from "bookingEndpoints";
import { am } from "utils/AssertionMessages"

test.beforeEach('Create Booking', async ({ request }) => {
  const response = await request.post(`${bookingURL}`, {
    data: randomBooking
  });
  
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  process.env.GET_BOOKING_ID_TEST_ID = responseBody.bookingid;
});

test('Get Booking By Existent Id @positive', async ({ request }) => {
  const id : number = Number.parseInt(process.env.GET_BOOKING_ID_TEST_ID);
  const response = await request.get(`${bookingURL}/${id}`);

  const responseBody = await response.json();  
  
  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(6);
  expect.soft(Object.keys(responseBody.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody, am.responseBody).toEqual(randomBooking);
});

test('Get Booking By Non-Existent Id @negative', async ({ request}) => {
  const id : number = 999999999999;
  const response = await request.get(`${bookingURL}/${id}`);

  expect.soft(response.status(), am.status).toBe(404);  
});

test('Get Booking By Id As * @negative', async ({ request }) => {
  const id : string = "*";
  const response = await request.get(`${bookingURL}/${id}`);

  expect.soft(response.status(), am.status).toBe(400);  
});

test('Get Booking By Id As String @negative', async ({ request }) => {
  const id : string = "ddsefrgrg";
  const response = await request.get(`${bookingURL}/${id}`);

  expect.soft(response.status(), am.status).toBe(400);  
});

test('Get Booking By Id As Logic Sentence "Id; DROP TABLE Bookings" @negative', async ({ request }) => {
const id : string = Number.parseInt(process.env.GET_BOOKING_ID_TEST_ID) + "; DROP TABLE bookings";
  const response = await request.get(`${bookingURL}/${id}`);

  expect.soft(response.status(), am.status).toBe(400);  
});

test('Get Booking By Id As Logic Sentence "IdOR1=1" @negative', async ({ request, baseURL }) => {
  const id : string = Number.parseInt(process.env.GET_BOOKING_ID_TEST_ID) + "'OR1=1#'";
  const response = await request.get(`${bookingURL}/${id}`);

  expect.soft(response.status(), am.status).toBe(400);  
});




