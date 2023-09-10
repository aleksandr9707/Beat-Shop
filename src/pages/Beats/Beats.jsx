import React, { useState } from 'react';
import './Beats.css'; 

function Beats() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div id="section">
            <nav>
                <div className="genre">Rap</div>
                <div className="genre">Pop</div>
                <div className="genre">Rock</div>
                <div className="genre">R&B</div>
            </nav>

            <div className="cat">
                <a className="active1" href="#melodic">Melodic</a>
                <a href="#drill">Drill</a>
                <a href="#trap">Trap</a>
                <a href="#drill">Rage</a>
                <a href="#trap">Old School</a>
            </div>

            <article id="container">
                <ul>
                    <li className="important-todos">
                        Title <span style={{paddingLeft: "50px"}}>Author</span> <span style={{paddingLeft: "50px"}}>Duration</span>
                    </li>
                    {Array.from({ length: 9 }, (_, index) => (
                        <li key={index} className="important-todos">
                            {index + 1} &nbsp;&nbsp;
                            <img src="playbutton.png" alt="Play button" /> &nbsp;&nbsp;Untitled
                        </li>
                    ))}
                </ul>
            </article>

            {/* The added MP3 upload and playback functionality */}
            <div className="mp3-upload">
                <label>
                    Upload a MP3:
                    <input type="file" accept=".mp3" onChange={handleFileChange} />
                </label>
                
                {selectedFile && (
                    <audio controls>
                        <source src={URL.createObjectURL(selectedFile)} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
        </div>
    );
}

export default Beats;
