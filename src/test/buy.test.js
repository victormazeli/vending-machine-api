import request from 'supertest';
import { StatusCode } from '../../statusCode';
import app from '../app';
import { faker } from '@faker-js/faker';

describe('Buy endpoint', () => {
  let buyerToken;
  let sellerToken;
  const buyerUsername = faker.random.alphaNumeric(5);
  const sellerUsername = faker.random.alphaNumeric(5);
  const productName = faker.name.fullName();
  let productId;
  let productPurchaseResp = [
    {
        coin: 100,
        count: 0,
    },
    {
        coin: 50,
        count: 0,
    },
    {
        coin: 20,
        count: 0,
    },
    {
        coin: 10,
        count: 0,
    },
    {
        coin: 5,
        count: 0,
    },
  ]

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

    // create a product
    const product = await request(app)
      .post('/product')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ productName: productName, amountAvailable: 10, cost: 50 });
    expect(product.status).toEqual(StatusCode.CREATED);
    expect(product.body.data.productName).toEqual(productName.toLowerCase());
    productId = product.body.data._id;


        const resp = await request(app)
          .post('/deposit')
          .set('Authorization', `Bearer ${buyerToken}`)
          .send({ deposit: 50 });
        expect(resp.status).toBe(StatusCode.OK);
        expect(resp.body.message).toBe('Coin deposit successful');
  });

  it('should allow buyer to purchase a product', async () => {
    const res = await request(app)
      .post('/buy')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId: productId, amount: 1 });
    expect(res.status).toBe(StatusCode.OK);
    expect(res.body.message).toBe('Product purchase successful');
    expect(res.body.data.totalSpent).toBe(50);
    expect(res.body.data.productPurchased.productName).toBe(productName.toLowerCase());
    expect(res.body.data.change).toEqual(productPurchaseResp);
  });

  it('should return an error for insufficient deposit', async () => {
    const res = await request(app)
      .post('/buy')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId: productId, amount: 2 });
    expect(res.status).toBe(StatusCode.BAD_REQUEST);
    expect(res.body.error).toBe(
      'Insufficient deposit: Please deposit more coins'
    );
  });

  it('should return an error for an invalid product', async () => {
    const res = await request(app)
      .post('/buy')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId: '99999', amount: 1 });
      console.log(res.body);
    expect(res.status).toBe(StatusCode.NOT_FOUND);
  });

  it('should return an error for an invalid amount', async () => {
    const res = await request(app)
      .post('/buy')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId: productId, amount: -1 });
    expect(res.status).toBe(StatusCode.BAD_REQUEST);
    expect(res.body.error).toBe(
        "\"amount\" must be greater than or equal to 1"
    );
  });
});
