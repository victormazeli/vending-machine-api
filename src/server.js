import app from "./app";
import dotenv from "dotenv"

dotenv.config();

const port = process.env.PORT || 8800;
const server = app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
