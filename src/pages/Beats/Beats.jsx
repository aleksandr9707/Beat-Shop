import React, { useState, useEffect } from 'react';
import './Beats.css';

function Beats({ user }) {
  const [songs, setSongs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!user) {
      alert('Please log in to upload songs.');
      return;
    }

    const formData = new FormData();
    formData.append('songFile', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSongs([...songs, data]);
      } else {
        console.error('Failed to upload the file');
      }
    } catch (error) {
      console.error('There was an error uploading the file', error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Filter and reorder songs based on the search query
    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredSongs(filtered);
  };

  useEffect(() => {
    // Fetch existing songs from the server when the component mounts
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/songs');
        if (response.ok) {
          const data = await response.json();
          setSongs(data);
        } else {
          console.error('Failed to fetch songs');
        }
      } catch (error) {
        console.error('There was an error fetching the songs', error);
      }
    };

    fetchSongs(); // Call the function to fetch songs when the component mounts
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div id="section">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button type="submit">Search</button>
      </form>

      <div className="song-list">
        {(searchQuery ? filteredSongs : songs).map((song, index) => (
          <div key={index} className="song-item">
              <div className="song-info">
                <div className="song-info-left">
                <p className="song-title" title={song.title || song.fileName || 'Filename'}>
                    {song.title || song.fileName || 'Filename'}
                </p>
                <p className="song-artist">{song.author || ''}</p>
                </div>
                <div className="song-duration">
                <p>{formatDuration(song.duration)}</p>
                </div>
            </div>
            <audio controls>
                <source src={song.filePath} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>

      {user && (
        <div className="mp3-upload">
          <label>
            Upload an MP3:
            <input type="file" accept=".mp3" onChange={handleFileChange} />
          </label>

          <button onClick={handleUpload}>Upload Song</button>

          {selectedFile && (
            <audio controls>
              <source src={URL.createObjectURL(selectedFile)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}

      {!user && <p>Please log in to upload songs.</p>}
    </div>
  );
}

function formatDuration(duration) {
  // Convert duration in seconds to minutes:seconds format
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default Beats;
