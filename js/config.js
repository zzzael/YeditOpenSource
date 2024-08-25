// config.js

// Configuration for the music player
const config = {
    tickerMessage: "Now Playing: Tune In for More Music!", // Edit your ticker message
    albumCoverImage: "images/cover.png", // Edit your png file! IT MUST BE CALLED cover.png !!!

    // Example track list; users can customize this with their own tracks
    trackList: [
        { name: "Pure Souls", artist: "Kanye West, Roddy Ricch", src: "music/puresouls.mp3" },
        // Add more tracks here if needed
    ]
};

// Ensure the configuration is loaded when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set ticker message and album cover from config
    document.getElementById('ticker-text').textContent = config.tickerMessage;
    document.getElementById('album-cover').src = config.albumCoverImage;

    // Pass the track list to the global scope
    window.trackList = config.trackList;
    window.albumCover = config.albumCoverImage;
});
