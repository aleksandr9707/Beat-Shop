import multer from 'multer';
import Song from '../models/Song.js';
import * as musicMetadata from 'music-metadata';

// Function to extract metadata from a file
const extractMetadata = async (filePath) => {
  try {
    const metadata = await musicMetadata.parseFile(filePath);
    return {
      title: metadata.common.title || 'Filename',
      artist: metadata.common.artist || '',
      duration: metadata.format.duration || 0,
    };
  } catch (error) {
    throw new Error(`Error extracting metadata: ${error.message}`);
  }
};

// Define the file filter function
const fileFilter = (req, file, cb) => {
  // Check for file types (e.g., .mp3, .wav)
  if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter, // Use the defined fileFilter
}).single('songFile'); // Note: Use .single() to specify a single file upload

// Function to upload a song and save it to the database
const uploadSong = async (req, res) => {
  try {
    const { title, artist, duration } = await extractMetadata(req.file.path);

    const song = new Song({
      name: title,
      author: artist,
      path: req.file.path,
      duration,
    });

    await song.save();

    res.json({
      title,
      artist,
      duration,
      filePath: req.file.path,
    });
  } catch (error) {
    res.status(500).send(`Error uploading the song: ${error.message}`);
  }
};

// Function to get a list of songs
const getSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).send(`Error retrieving songs: ${error.message}`);
  }
};

export { uploadSong, getSongs, uploadMiddleware };
