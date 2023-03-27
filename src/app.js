import express from 'express';
import connectDB from './config/dbconfig';
import routes from './routes/route';
import {errorHandler, notFound} from './middlewares/errorHandler'
import helmet from "helmet";
import * as dotenv from "dotenv"
import morgan from 'morgan'
import cors from 'cors'
const app = express();

dotenv.config();

connectDB();

// set cors
app.use(cors())

// set headers using helmet
app.use(helmet());

// body parser
app.use(express.json());
// set http logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use(routes);

app.use('*', notFound)

// error handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Welcome, Vending machine api');
});


export default app;
