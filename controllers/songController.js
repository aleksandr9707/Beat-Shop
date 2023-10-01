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
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract metadata from the uploaded file
        const metadata = await musicMetadata.parseFile(req.file.path);
        console.log('Extracted Metadata:', metadata);
        const title = metadata.common.title || "Filename";
        const author = metadata.common.artist || " ";
        const duration = metadata.format.duration;

        const song = new Song({
            name: title, // Use the extracted title
            author: author, // Use the extracted author
            path: req.file.path,
            duration: duration // Use the extracted duration
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
