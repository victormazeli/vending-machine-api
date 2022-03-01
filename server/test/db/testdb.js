import mongoose, { Collection } from "mongoose";
import MongoMemoryServer from "mongodb-memory-server-core";

const mongod = new MongoMemoryServer();

// connect to DB

const connectDB = async () => {
    const uri = await mongod.getUri();
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10
    }
    await mongoose.connect(uri, options);
}

// close DB

const closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

// clear DB

const clearDB = async () => {
    const collections = mongoose.connection.collection();
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

export default {
    connectDB,
    closeDB,
    clearDB
}