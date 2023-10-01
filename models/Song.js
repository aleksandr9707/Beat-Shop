import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
    name: String, // This should represent the title of the song
    author: String, // This should represent the author/artist of the song
    path: String,
    duration: Number
});

const Song = mongoose.model('Song', SongSchema);

export default Song;
