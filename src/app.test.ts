import request from 'supertest';
import app from './app.js';

// GET /hello endpoint tests
describe('GET /hello', () => {
  it('should return 200 status code', async () => {
    const response = await request(app).get('/hello');
    expect(response.status).toBe(200);
  });

  it('should return "Hello, World!" as response', async () => {
    const response = await request(app).get('/hello');
    expect(response.text).toBe('Hello, World!');
  });
});

// GET /hello/:username endpoint tests
describe('GET /hello/:username', () => {
  it('should return 200 status code', async () => {
    const response = await request(app).get('/hello/John');
    expect(response.status).toBe(200);
  });

  it('should return personalized greeting', async () => {
    const response = await request(app).get('/hello/John');
    expect(response.text).toBe('Hello, John!');
  });

  it('Should return 400 status code for missing username', async () => {
    const response = await request(app).get('/hello/');
    expect(response.status).toBe(400);
  });
});

// POST /hello endpoint tests
describe('POST /hello', () => {
  it('should return 200 status code with valid username', async () => {
    const response = await request(app)
      .post('/hello')
      .send({ username: 'Alice' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Alice!');
  });

  it('should return 400 status code with missing username', async () => {
    const response = await request(app).post('/hello').send({});
    expect(response.status).toBe(400);
    expect(response.text).toBe('Username is required');
  });
});
