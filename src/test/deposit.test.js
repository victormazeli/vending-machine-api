import request from 'supertest';
import { StatusCode } from '../../statusCode';
import app from '../app';
import { faker } from '@faker-js/faker';

describe('Deposit endpoint', () => {
  let buyerToken;
  let sellerToken;
  const buyerUsername = faker.random.alphaNumeric(5);
  const sellerUsername = faker.random.alphaNumeric(5);

  beforeAll(async () => {
        // register buyer user
    const res = await request(app).post('/user').send({
      username: buyerUsername,
      password: 'password2023',
      role: 'buyer',
    });
    expect(res.status).toEqual(StatusCode.CREATED);
    expect(res.body.data.username).toBe(buyerUsername);

    // register seller user
    const re = await request(app).post('/user').send({
      username: sellerUsername,
      password: 'password2023',
      role: 'seller',
    });
    expect(re.status).toEqual(StatusCode.CREATED);
    expect(re.body.data.username).toBe(sellerUsername);

    // Login as buyer user
    const buyerLogin = await request(app)
      .post('/login')
      .send({ username: buyerUsername, password: 'password2023' });

    // console.log(buyerLogin.body);
    expect(buyerLogin.status).toEqual(StatusCode.OK);
    buyerToken = buyerLogin.body.data.token;

    // login as seller user
    const sellerLogin = await request(app)
      .post('/login')
      .send({ username: sellerUsername, password: 'password2023' });

    expect(buyerLogin.status).toEqual(StatusCode.OK);
    sellerToken = sellerLogin.body.data.token;
  });

  // afterAll(async () => {
  //   const res = await request(app)
  //     .post('/logout/all')
  //     .set('Authorization', `Bearer ${buyerToken}`);
  //   expect(res.status).toBe(StatusCode.OK);

  //   const resp = await request(app)
  //     .post('/logout/all')
  //     .set('Authorization', `Bearer ${sellerToken}`);
  //   expect(resp.status).toBe(StatusCode.OK);
  // });

  it('should allow buyer to deposit a valid coin', async () => {
    const res = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ deposit: 5 });
    expect(res.status).toBe(StatusCode.OK);
    expect(res.body.message).toBe('Coin deposit successful');
  });

  it('should not allow seller to deposit a valid coin', async () => {
    const res = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ deposit: 5 });
    expect(res.status).toBe(StatusCode.FORBIDDEN);
    expect(res.body.error).toBe('Only buyers allowed');
  });

  it('should return an error for an invalid coin', async () => {
    const res = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ deposit: 7 });
    expect(res.status).toBe(StatusCode.BAD_REQUEST);
    expect(res.body.error).toBe(
      'Invalid coin deposit: Only 5, 10, 20, 50, and 100 cent coins are accepted'
    );
  });
});
