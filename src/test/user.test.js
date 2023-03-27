// import testdb from "./db/testdb";
import request from "supertest";
import { StatusCode } from "../../statusCode";
import app from "../app";
import { faker } from "@faker-js/faker"

  // Test CRUD endpoints for users
  describe('User Endpoints', () => {

    let token;
    let id;
    const username = faker.random.alphaNumeric(5);
    const newusername = faker.random.alphaNumeric(5);

    beforeAll(async () => {
        // register user
        const res = await request(app)
        .post('/user')
        .send({
          username: username,
          password: 'password2023',
          role: 'buyer'
        })
        // console.log(res.body.data._id)
    expect(res.status).toEqual(StatusCode.CREATED)
    expect(res.body.data.username).toBe(username);
      id = res.body.data._id

      // Login to obtain JWT token for authenticated requests
      const response = await request(app)
        .post('/login')
        .send({
          username: username,
          password: 'password2023'
        })
    expect(response.statusCode).toEqual(StatusCode.OK)
      token = response.body.data.token;
    });

    it('GET /user should return list of all users', async () => {
      const response = await request(app)
        .get('/user')
    expect(response.status).toEqual(StatusCode.OK)
    expect(response.body.data.length).toBeGreaterThanOrEqual(1); // Only the newly registered user should exist or more if exist
    // expect(response.body.data).toContain('cipher');
    });

    it('GET /user/:id should return user with specified id', async () => {
      const response = await request(app)
        .get(`/user/${id}`)
    expect(response.status).toEqual(StatusCode.OK);
    expect(response.body.data.username).toBe(username);
    });

    it('GET /user should return currently logged in user', async () => {
        const response = await request(app)
          .get(`/user/me`)
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toEqual(StatusCode.OK);
      expect(response.body.data.username).toBe(username);
      });

    it('GET /user/:id should return 404 for invalid user id', async () => {
      const response = await request(app)
        .get('/user/999')
    expect(response.status).toEqual(StatusCode.NOT_FOUND);
    });

    it('PUT /user/:id should update user with specified id', async () => {
      const response = await request(app)
        .put(`/user/edit/${id}`)
        .send({
          username: newusername
        })
    expect(response.status).toEqual(StatusCode.OK);
    expect(response.body.data.username).toBe(newusername);
    });

    it('DELETE /user/:id should delete user with specified id', async () => {
      const response = await request(app)
        .delete(`/user/${id}`)
    expect(response.statusCode).toEqual(StatusCode.OK);

      // Ensure user has been deleted
     await request(app)
        .get(`/user/${id}`)
        .expect(404);
    });

  });
