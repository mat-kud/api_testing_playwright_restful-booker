import { expect, test } from "playwright/test";
import { randomBooking, generateRandomBooking } from "test-data/generateRandomBooking";
import { bookingAuthURL, bookingURL } from "bookingEndpoints";
import * as putData from "test-data/patchBookingData"
import { am } from "utils/AssertionMessages"
import { Booking } from "utils/BookingInterface";
import { faker } from "@faker-js/faker";

test.beforeEach('Create Booking', async ({ request }) => {
    const responsePost = await request.post(`${bookingURL}`, {
        data: randomBooking
    });

    expect(responsePost.status()).toBe(200);

    const responseBody = await responsePost.json();
    process.env.PATCH_BOOKING_TEST_ID = responseBody.bookingid;

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
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newBooking = generateRandomBooking();
    const response = await request.patch(`${bookingURL}/${id}`, {
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
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newBooking = generateRandomBooking();
    const response = await request.patch(`${bookingURL}/${id}`, {
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

test('Update Booking Price @positive', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newTotalPrice: number = randomBooking.totalprice + 100;
    const updatedBooking: Booking = putData.updateBookingTotalPrice(randomBooking, newTotalPrice);
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            totalprice: newTotalPrice
        }
    });

    const responseBody = await response.json();

    expect.soft(response.status(), am.status).toBe(200);
    expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
    expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(6);
    expect.soft(Object.keys(responseBody.bookingdates).length, am.bookingDatesLength).toEqual(2);
    expect.soft(responseBody, am.responseBody).toEqual(updatedBooking);
});

test('Update Booking Checkout Date @positive', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newCheckoutDate = new Date(faker.date.between({ from: '2025-07-01', to: '2025-12-31' })).toISOString().slice(0, 10);
    const updatedBooking: Booking = putData.updateBookingCheckoutDate(randomBooking, newCheckoutDate);
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            bookingdates: {
                checkout: newCheckoutDate
            }
        }
    });
    console.log(response);
    const responseBody = await response.json();

    expect.soft(response.status(), am.status).toBe(200);
    expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
    expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(6);
    expect.soft(Object.keys(responseBody.bookingdates).length, am.bookingDatesLength).toEqual(2);
    expect.soft(responseBody, am.responseBody).toEqual(updatedBooking);
});

test('Update Booking Additional Needs @positive', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newAdditionalNeeds = "Suprise us!"
    const updatedBooking: Booking = putData.updateBookingAdditionalNeeds(randomBooking, newAdditionalNeeds);
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            additionalneeds: newAdditionalNeeds
        }
    });

    const responseBody = await response.json();

    expect.soft(response.status(), am.status).toBe(200);
    expect.soft(response.headers()['content-type'], am.contentType).toContain('application/json');
    expect.soft(Object.keys(responseBody).length, am.responseLength).toEqual(6);
    expect.soft(Object.keys(responseBody.bookingdates).length, am.bookingDatesLength).toEqual(2);
    expect.soft(responseBody, am.responseBody).toEqual(updatedBooking);
});

test('Update Booking With Invalid Price @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newTotalPrice: number = 0;
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            totalprice: newTotalPrice
        }
    });
    expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Logic Sentence As Additional Needs @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newAdditionalNeeds: string = "Breakfast + dinner; DROP TABLE customers; --";
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            additionalneeds: newAdditionalNeeds
        }
    });
    expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Empty Deposit Paid Value @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newDepositPaid: string = "";
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            depositpaid: newDepositPaid
        }
    });
    expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Invalid Checkout Date Format @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newCheckoutDate: string = "26-11-2025";
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            bookingdates: {
                checkout: newCheckoutDate
            }
        }
    });
    expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Checkout Date Earlier Than Checkin Date @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PATCH_BOOKING_TEST_ID);
    const newCheckinDate: string = "2025-05-01"
    const newCheckoutDate: string = "2025-04-30";
    const response = await request.patch(`${bookingURL}/${id}`, {
        data: {
            bookingdates: {
                checkin: newCheckinDate,
                checkout: newCheckoutDate
            }
        }
    });
    expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Invalid Token Auth With Valid First Name @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID);
    const newFirstName = "Adrien";
    const response = await request.put(`${bookingURL}/${id}`, {
        data: {
            firstname: newFirstName
        },
        headers: {
            "Cookie": `token=ds4regt578g`
        }
    });

    expect.soft(response.status(), am.status).toBe(400);
});

test('Update Booking With Invalid Basic Auth With Valid Last Name @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.PUT_BOOKING_TEST_ID);
    const newLastName = "Kazalin";
    const response = await request.put(`${bookingURL}/${id}`, {
        data: {
            lastname: newLastName
        },
        headers: {
            "Authorization": `Basic h54=d45Jg568gfGRfd=`
        }
    });

    expect.soft(response.status(), am.status).toBe(400);
});












