import { Server } from '../src/server';
import request from 'supertest';

const serverInstance = new Server().server;
const invalidUUID = '99d58f68-bf14-4a99-bc5d-'

describe('/GET users', () => {
  it('Get /api/users - to return array', async () => {
    const { body, statusCode } = await request(serverInstance).get(
      '/api/users'
    );
    expect(statusCode).toBe(200);
    expect(body).toEqual(expect.arrayContaining([]));
  });
  it('POST /api/users - failure on invalid post body', async () => {
    const { statusCode } = await request(serverInstance)
      .post('/api/users')
      .send({
        name: '',
      });
    expect(statusCode).toBe(400);
  });
  it('POST /api/users - success', async () => {
    const { text, statusCode } = await request(serverInstance)
      .post('/api/users')
      .send({
        username: 'crocs',
        age: 22,
        hobbies: ['clogs', 'boots'],
      });
    expect(statusCode).toBe(201);
    expect(text).toBe('POST Request - user created');
  });
  it('PUT /api/users/{invalid v4 UUID} - failure with ', async () => {
    const newData = {
      username: 'Kangol',
      age: 86,
      hobbies: ['hats', 'caps'],
    }
    const { text, statusCode} = await request(serverInstance)
      .put(`/api/users/${invalidUUID}`)
      .send(newData);
    expect(statusCode).toBe(400)
    expect(text).toBe('Please provide valid UUID...')
  });
});
