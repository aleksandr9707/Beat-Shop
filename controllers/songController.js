import multer from 'multer';
import Song from '../models/Song.js';
import * as musicMetadata from 'music-metadata'; // Import the music-metadata library

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Check for file types (e.g., .mp3, .wav)
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const uploadSong = async (req, res) => {
    try {
        let title = req.file.originalname; // Use let to allow reassignment
        let author = "Unknown Artist";
        let duration = 0;

        const metadata = await musicMetadata.parseFile(req.file.path);
        console.log('Extracted Metadata:', metadata);

        if (metadata.common.title) {
            title = metadata.common.title;
        }

        if (metadata.common.artist) {
            author = metadata.common.artist;
        }

        if (metadata.format.duration) {
            duration = metadata.format.duration;
        }

        const song = new Song({
            name: title,
            author: author,
            path: req.file.path,
            duration: duration
        });

        await song.save();
        res.json({
            title,
            author,
            duration,
            filePath: req.file.path
        });
    } catch (error) {
        res.status(500).send(`Error uploading the song: ${error.message}`);
    }
};



const getSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).send(`Error retrieving songs: ${error.message}`);
    }
};

const uploadMiddleware = upload.single('songFile');

export { uploadSong, getSongs, uploadMiddleware };
