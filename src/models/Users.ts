import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: false}
})

const users = mongoose.model('User', userSchema);


export default users;