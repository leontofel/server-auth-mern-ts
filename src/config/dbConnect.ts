import mongoose from "mongoose";
import env from 'dotenv';
env.config();


mongoose.connect(`mongodb+srv://leo_tofel:<password>@cluster0.bpc4ur9.mongodb.net/test`);

let db = mongoose.connection;

export default db;




