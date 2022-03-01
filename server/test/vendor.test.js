// import testdb from "./db/testdb";
import request from "supertest";
import app from "../app";
import { StatusCode } from "../../statusCode";

// beforeAll(async () => await testdb.connectDB());

// afterEach(async () => await testdb.clearDB());

// afterAll(async () => await testdb.closeDB());

describe('Performing CRUD operaations and others on Vendor', () => {
   
    describe('GET Request: root url', () => {
        it(' root url', async() => {
            const res = await request(app)
            .get('/vendors')
            expect(res.statusCode).toEqual(StatusCode.OK)

        })

    })

})