import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: './.env' });
console.log(process.env.DATABASE_URL);

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cors from 'cors';
import * as musicMetadata from 'music-metadata';
import { uploadSong, getSongs, uploadMiddleware } from './controllers/songController.js';

import './config/database.js';  // Now, by the time this is imported, dotenvConfig() has already been called.
import userRoutes from './routes/users.js';
import songRoutes from './routes/songRoutes.js';


const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(process.cwd(), 'build', 'favicon.ico')));
app.use(express.static(path.join(process.cwd(), 'build')));
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);

// Song upload with metadata extraction
app.post('/api/upload', uploadMiddleware, async (req, res) => {
  try {
      const metadata = await musicMetadata.parseFile(req.file.path);
      console.log(metadata); // Add this line to debug metadata extraction
      const title = metadata.common.title || req.file.originalname;
      const author = metadata.common.artist || "";
      const duration = metadata.format.duration;

      // TODO: Save title, author, duration, and filePath to the database

      res.status(200).json({
          title,
          author,
          duration,
          filePath: req.file.path
      });
  } catch (error) {
      console.error(error); // Log any errors for debugging
      res.status(500).send('Error processing file');
  }
});


// Catch-all Route to serve your React app
app.get('/*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});

// Server listening
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Express app running on port ${port}`);
});
