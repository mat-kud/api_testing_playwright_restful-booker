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
  process.env.GET_BOOKING_IDS_TEST_ID = responseBody.bookingid;
});

test('Get Booking Ids By Lastname @positive', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      lastname: randomBooking.lastname
    }
  });
  
  const expectedObject = {bookingid: Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)};
  const responseBody = await response.json();
  
  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(responseBody, am.responseId).toEqual(expect.arrayContaining([expectedObject]));
  //just for learning purposes
  expect.soft(responseBody).not.toEqual([]);
  expect(await response.json().then(data => data.some(
    (obj: { bookingid: number }) =>
      obj.bookingid === Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)
  )),).toBeTruthy();
});

test('Get Booking Ids By Checkin Date @positive', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkin: randomBooking.bookingdates.checkin
    }
  });

  const expectedObject = {bookingid: Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)};
  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(responseBody, am.responseId).toEqual(expect.arrayContaining([expectedObject]));
});


test('Get Booking Ids By Checkout Date @positive', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkout: randomBooking.bookingdates.checkout
    },
  });

  const expectedObject = {bookingid: Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)};
  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(responseBody, am.responseId).toEqual(expect.arrayContaining([expectedObject]));
});

test('Get Booking Ids By Booking Dates @positive', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkin: randomBooking.bookingdates.checkin,
      checkout: randomBooking.bookingdates.checkout
    },
  });

  const expectedObject = {bookingid: Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)};
  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(responseBody, am.responseId).toEqual(expect.arrayContaining([expectedObject]));
});

test('Get Booking Ids By Checkin Date Later By One Day @negative', async ({ request }) => {
  const bookingCheckinLaterByOneDay = new Date(randomBooking.bookingdates.checkin);
  bookingCheckinLaterByOneDay.setDate(bookingCheckinLaterByOneDay.getDate() + 1);
  
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkin: bookingCheckinLaterByOneDay.toISOString().slice(0,10)
    },
  });

  const expectedObject = {bookingid: Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)};
  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(responseBody, am.responseNoId).not.toEqual(expect.arrayContaining([expectedObject]));
});

test('Get Booking Ids By Checkin Date Earlier By One Day @negative', async ({ request }) => {
  const bookingCheckinEarlierByOneDay = new Date(randomBooking.bookingdates.checkin);
  bookingCheckinEarlierByOneDay.setDate(bookingCheckinEarlierByOneDay.getDate() - 1);
  
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkin: bookingCheckinEarlierByOneDay.toISOString().slice(0,10)
    },
  });

  const expectedObject = {bookingid: Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)};
  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(responseBody, am.responseId).toEqual(expect.arrayContaining([expectedObject]));
});

test('Get Booking Ids By Wrong Booking Checkin Date Format DD-MM-YYYY @negative', async ({ request }) => {
  const checkin : string = randomBooking.bookingdates.checkin;
  const checkinWrongFormat : string = checkin.slice(8,10) + checkin.slice(4,8) + checkin.slice(0,4);
  
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkin: checkinWrongFormat
    },
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Get Booking Ids By Wrong Booking Checkout Date Format DD-MM-YYYY @negative', async ({ request }) => {
  const checkout : string = randomBooking.bookingdates.checkout;
  const checkoutWrongFormat : string = checkout.slice(8,10) + checkout.slice(4,8) + checkout.slice(0,4);
  
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkout: checkoutWrongFormat
    },
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Get Booking Ids By Swaping Checkin And Checkout Dates Position @negative', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkout: randomBooking.bookingdates.checkout,
      checkin: randomBooking.bookingdates.checkin
    },
  });

  const expectedObject = {bookingid: Number.parseInt(process.env.GET_BOOKING_IDS_TEST_ID)};
  const responseBody = await response.json();

  expect.soft(response.status(), am.status).toBe(200);
  expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
  expect.soft(responseBody, "Verify the id is in the response").toEqual(expect.arrayContaining([expectedObject]));
});

test('Get Booking Ids By Checkin Date As String @negative', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      checkin: "dfdgggfgfgfgf"
    },
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Get Booking Ids By Lastname As Logic Sentence @negative', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      lastname: "1%20OR1=1"
    },
  });

  expect.soft(response.status(), am.status).toBe(400);
});

test('Get Booking Ids By Lastname As Number @negative', async ({ request }) => {
  const response = await request.get(`${bookingURL}`, {
    params: {
      lastname: 303
    },
  });

  expect.soft(response.status(), am.status).toBe(400);
});







