import * as dotenv from "dotenv";

dotenv.config();

const config = {
  development:  process.env.DEVELOPEMNT_DATABASE,
  production: process.env.PRODUCTION_DATABASE
};

export default config
