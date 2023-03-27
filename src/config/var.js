import * as dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(__dirname, '../../.env')});

const AppEnv = {
    jwtKey: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE,
    developmentDb: process.env.DEVELOPEMNT_DATABASE
}

export default AppEnv