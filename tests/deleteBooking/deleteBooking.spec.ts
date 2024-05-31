import { expect, test } from "playwright/test";
import { randomBooking, generateRandomBooking } from "test-data/generateRandomBooking";
import { bookingAuthURL, bookingURL } from "bookingEndpoints";
import { am } from "utils/AssertionMessages"

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

test('Delete Booking With Valid Id With Token Auth @positive', async ({ request }) => {
    const id: number = Number.parseInt(process.env.DELETE_BOOKING_TEST_ID);
    const newBooking = generateRandomBooking();
    let response = await request.delete(`${bookingURL}/${id}`, {
        headers: {
            "Cookie": `token=${process.env.TOKEN}`
        }
    });

    expect.soft(response.status(), am.status).toBe(200);
    
    response = await request.get(`${bookingURL}/${id}`);

    expect.soft(response.status(), am.status).toBe(404);
});

test('Delete Booking With Valid Id With Basic Auth @positive', async ({ request }) => {
    const id: number = Number.parseInt(process.env.DELETE_BOOKING_TEST_ID);
    const newBooking = generateRandomBooking();
    let response = await request.delete(`${bookingURL}/${id}`, {
        headers: {
            "Authorization": `Basic YWRtaW46cGFzc3dvcmQxMjM=`
        }
    });

    expect.soft(response.status(), am.status).toBe(200);
    
    response = await request.get(`${bookingURL}/${id}`);

    expect.soft(response.status(), am.status).toBe(404);
});

test('Delete Booking With Valid Id @positive', async ({ request }) => {
    const id: number = Number.parseInt(process.env.DELETE_BOOKING_TEST_ID);
    const newBooking = generateRandomBooking();
    let response = await request.delete(`${bookingURL}/${id}`);

    expect.soft(response.status(), am.status).toBe(200);
    
    response = await request.get(`${bookingURL}/${id}`);

    expect.soft(response.status(), am.status).toBe(404);
});

test('Delete Booking With Invalid Id With Token Auth @negative', async ({ request }) => {
    const id: number = 99999999999999;
    const newBooking = generateRandomBooking();
    let response = await request.delete(`${bookingURL}/${id}`, {
        headers: {
            "Cookie": `token=${process.env.TOKEN}`
        }
    });
    expect.soft(response.status(), am.status).toBe(404);
});

test('Delete Booking With Invalid Format Id With Token Auth @negative', async ({ request }) => {
    const id: string = "Adam";
    const newBooking = generateRandomBooking();
    let response = await request.delete(`${bookingURL}/${id}`, {
        headers: {
            "Cookie": `token=${process.env.TOKEN}`
        }
    });
    expect.soft(response.status(), am.status).toBe(400);
});

test('Delete Booking That Was Previously Deleted @negative', async ({ request }) => {
    const id: number = Number.parseInt(process.env.DELETE_BOOKING_TEST_ID);
    const newBooking = generateRandomBooking();
    let response = await request.delete(`${bookingURL}/${id}`, {
        headers: {
            "Cookie": `token=${process.env.TOKEN}`
        }
    });
    expect.soft(response.status(), am.status).toBe(200);

    response = await request.delete(`${bookingURL}/${id}`, {
        headers: {
            "Cookie": `token=${process.env.TOKEN}`
        }
    });
    expect.soft(response.status(), am.status).toBe(404);
});