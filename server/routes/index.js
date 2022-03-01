import express from "express";
import vendorRoutes from "./vendors";
import userRoutes from "./users";

const app = express();

/**
 * @description - This the root route for all services.
 */

app.use('/vendors', vendorRoutes);
app.use('/users', userRoutes);


export default app;

