import express from 'express';
import { uploadSong, getSongs, uploadMiddleware } from '../controllers/songController.js';
import * as musicMetadata from 'music-metadata'; // Import music-metadata here

const router = express.Router();

router.post('/upload', uploadMiddleware, async (req, res) => {
    try {
        // Extract metadata from the uploaded MP3 file
        const metadata = await musicMetadata.parseFile(req.file.path);

        // Access metadata properties like title, artist, etc.
        const title = metadata.common.title || 'Filename';
        const artist = metadata.common.artist || '';
        const duration = metadata.format.duration;

        // Call the uploadSong function with the extracted metadata
        uploadSong(req, res, { title, artist, duration });
    } catch (error) {
        console.error('Error processing file', error);
        res.status(500).send('Error processing file');
    }
});

router.get('/songs', getSongs);

export default router;
