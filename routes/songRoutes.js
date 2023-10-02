import express from 'express';
import { uploadSong, getSongs } from '../controllers/songController.js';

const router = express.Router();

// Handle song upload
router.post('/upload', uploadSong);

// Get a list of songs
router.get('/songs', getSongs);

export default router;
