import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    id: Number,
    name: String,
    genre: String,
    musics: [String],
    user_id: String
})

const playlists = mongoose.model('Playlist', playlistSchema);


export default playlists;
