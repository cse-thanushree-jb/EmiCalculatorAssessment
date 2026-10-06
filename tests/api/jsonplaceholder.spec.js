const { test, expect } = require('@playwright/test');

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

test.describe('JSONPlaceholder POST boundary behavior', () => {
  test('creates a post with a normal payload', async ({ request }) => {
    const response = await request.post(API_URL, {
      data: { title: 'Assessment test', body: 'Normal post body', userId: 1 }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ title: 'Assessment test', body: 'Normal post body', userId: 1 });
    expect(body.id).toBeTruthy();
  });

  test('records observed behavior for excessively long title', async ({ request }) => {
    const response = await request.post(API_URL, {
      data: { title: 'T'.repeat(10000), body: 'Long title boundary test', userId: 1 }
    });
    // JSONPlaceholder is a mock API and commonly accepts this input with 201.
    expect([201, 400, 413, 422]).toContain(response.status());
    const body = await response.json().catch(() => ({}));
    expect(typeof body).toBe('object');
  });

  test('records observed behavior for special characters', async ({ request }) => {
    const title = '!@#$%^&*()_+-=[]{};:,.<>/?|\\~"\' unicode-ñ-漢字';
    const response = await request.post(API_URL, {
      data: { title, body: 'Special character boundary test', userId: 1 }
    });
    expect([201, 400, 422]).toContain(response.status());
    const body = await response.json().catch(() => ({}));
    if (response.status() === 201) expect(body.title).toBe(title);
  });

  test('documents missing userId behavior without assuming strict validation', async ({ request }) => {
    const response = await request.post(API_URL, {
      data: { title: 'Missing userId', body: 'JSONPlaceholder mock behavior test' }
    });
    expect([201, 400, 422]).toContain(response.status());
    const body = await response.json().catch(() => ({}));
    if (response.status() === 201) {
      expect(body.title).toBe('Missing userId');
      // The fake API may echo the payload and synthesize an ID; missing userId is not guaranteed to be rejected.
    }
  });
});
