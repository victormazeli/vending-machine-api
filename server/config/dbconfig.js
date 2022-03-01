import mongoose from 'mongoose';
import config from './dbconstant';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.development, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        
    }
};

export default connectDB;