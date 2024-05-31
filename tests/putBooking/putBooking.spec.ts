import { expect, test } from "playwright/test";
import { randomBooking, generateRandomBooking } from "test-data/generateRandomBooking";
import { bookingAuthURL, bookingURL } from "bookingEndpoints";
import * as putData from "test-data/putBookingData"
import { am } from "utils/AssertionMessages"

test.beforeEach('Create Booking', async ({ request }) => {
    const responsePost = await request.post(`${bookingURL}`, {
      data: randomBooking
    });
    
    expect(responsePost.status()).toBe(200);
  
    const responseBody = await responsePost.json();
    process.env.PUT_BOOKING_TEST_ID = responseBody.bookingid;

    const responseAuth = await request.post(`${bookingAuthURL}`, {
      data: {
        username: `${process.env.USERNAME_ADMIN}`,
        password: `${process.env.USER_ADMIN_PASSWORD}`,
      },
    });
  
    const body = await responseAuth.json();
    process.env.TOKEN = body.token;
});

test('Update Booking With Token Auth With Valid Data @positive', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: newBooking,
    headers: {
      "Cookie": `token=${process.env.TOKEN}`
    }
  });
  
  const responseBody = await response.json();  
  
  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(6);
  expect.soft(Object.keys(responseBody.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody, am.responseBody).toEqual(newBooking);
});

test('Update Booking With Basic Auth With Valid Data @positive', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: newBooking,
    headers: {
      "Authorization": `Basic YWRtaW46cGFzc3dvcmQxMjM=`
    }
  });
  
  const responseBody = await response.json();  
  
  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(6);
  expect.soft(Object.keys(responseBody.bookingdates).length, am.bookingDatesLength).toEqual(2);
  expect.soft(responseBody, am.responseBody).toEqual(newBooking);
});



test('Update Booking With Empty Last Name @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: putData.createBookingEmptyLastName(newBooking)
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Last Name As Logic Sentence "Brown; DROP TABLE users;--"  @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: putData.createBookingLogicSentenceAsLastName(newBooking)
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With No Last Name @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: putData.createBookingNoLastName(newBooking)
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Checkin Date Later Than Checkout Date @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: putData.createBookingCheckinLaterThanCheckout(newBooking),
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Negative Total Price @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: putData.createBookingNegativeTotalPrice(newBooking)
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Application/JSON Content-Type Header And XML Payload @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: putData.createBookingXMLFormat(newBooking)
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Invalid Token Auth With Valid Data @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: newBooking,
    headers: {
      "Cookie": `token=ds4ref54dyynee`
    }
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Invalid Basic Auth With Valid Data @negative', async ({ request }) => {
  const id : number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID); 
  const newBooking = generateRandomBooking();
  const response = await request.put(`${bookingURL}/${id}`, {
    data: newBooking,
    headers: {
      "Authorization": `Basic h54=d45J6g5fGRfd=`
    }
  });
  
  expect.soft(response.status(), am.status).toBe(400);
});







  