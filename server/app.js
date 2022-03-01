import express from 'express';
import connectDB from './config/dbconfig';
import routes from './routes/index';
const app = express();

connectDB();

app.use(routes);

app.get('/', (req, res) => {
  res.send('Welcome, Testing api');
});


export default app;
