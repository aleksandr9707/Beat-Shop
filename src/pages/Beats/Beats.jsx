import React, { useState, useEffect } from 'react';
import './Beats.css';

function Beats({ user }) {
    const [songs, setSongs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

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

    useEffect(() => {
        // Fetch existing songs from the server when the component mounts
        fetch('/api/songs')
            .then((response) => response.json())
            .then((data) => {
                setSongs(data);
            })
            .catch((error) => {
                console.error('There was an error fetching the songs', error);
            });
    }, []);

    return (
        <div id="section">
            <div className="song-list">
                {songs.map((song, index) => (
                    <div key={index} className="song-item">
                        <audio controls>
                            <source src={song.filePath} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <div className="song-info">
                            <p className="song-title">{song.title || song.fileName || 'Filename'}</p>
                            <p className="song-artist">{song.author || ''}</p>
                            <p className="song-duration">{formatDuration(song.duration)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MP3 upload and playback functionality */}
            {user && (
                <div className="mp3-upload">
                    <label>
                        Upload a MP3:
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

            {!user && <p>Please log in to upload songs.</p>} {/* Display a message if not logged in */}
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
