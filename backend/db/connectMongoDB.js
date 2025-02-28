import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


export default connectMongoDB;
