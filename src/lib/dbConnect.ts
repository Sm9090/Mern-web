import mongoose from "mongoose";
require('dotenv').config()

type ConnectionObject ={
    isConnected?: number
}

const connection: ConnectionObject = {};


async function dbConnect() {
    if (connection.isConnected) {
        console.log("Using existing connection");
        return;
    }

    try {
       const db = await mongoose.connect(process.env.MONGO_URI || "", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
        });
        console.log(db)

        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    };
}

export default dbConnect;