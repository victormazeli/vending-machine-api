// import testdb from "./db/testdb";
import request from "supertest";
import { StatusCode } from "../../statusCode";
import app from "../app";

// beforeAll(async () => await testdb.connectDB());

// afterEach(async () => await testdb.clearDB());

// afterAll(async () => await testdb.closeDB());

describe('Performing CRUD operations and others on Users', () => {
   
    describe('GET Request: root url', () => {
        it(' root url', async() => {
            const res = await request(app)
            .get('/users')
            expect(res.statusCode).toEqual(StatusCode.OK)

        })

    })

})