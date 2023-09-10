const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
require('dotenv').config();
require('./config/database');

const app = express();
const User = require('./models/user');
const userRoutes = require('./routes/users');
const bcrypt = require('bcrypt');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/api/users', userRoutes);

// Routes

// Catch-all Route to serve your React app
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Server listening
const port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log(`Express app running on port ${port}`);
});

