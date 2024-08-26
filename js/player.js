// player.js

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const hoverTime = document.getElementById('hover-time');
    const tracklistContainer = document.getElementById('tracklist-container');
    const playPauseButton = document.getElementById('play-pause-button');
    const backButton = document.getElementById('back');
    const skipButton = document.getElementById('skip');
    const currentTimeElement = document.getElementById('current-time');
    const totalTimeElement = document.getElementById('total-time');
    const trackNameElement = document.getElementById('current-track-name');
    const trackArtistElement = document.getElementById('current-track-artist');
    const playerContainer = document.getElementById('player-container');
    const loadingMessage = document.getElementById('loading-message');
    
    let currentTrackIndex = 0;
    let isPlaying = false;

    if (typeof window.trackList === 'undefined') {
        throw new Error('Track list is not defined. Please check config.js.');
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function loadTrack(index) {
        const track = window.trackList[index];
        audioPlayer.src = track.src;
        trackNameElement.innerText = track.name;
        trackArtistElement.innerText = track.artist;
        document.getElementById('album-cover').src = window.albumCover;
        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeElement.innerText = formatTime(audioPlayer.duration);
        });
    }

    function playTrack(index) {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playAudio();
    }

    function playAudio() {
        audioPlayer.play();
        isPlaying = true;
        playPauseButton.innerText = 'Pause';
    }

    function pauseAudio() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseButton.innerText = 'Play';
    }

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    backButton.addEventListener('click', () => {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
        } else {
            currentTrackIndex = window.trackList.length - 1;
        }
        loadTrack(currentTrackIndex);
        playAudio();
    });

    skipButton.addEventListener('click', () => {
        if (currentTrackIndex < window.trackList.length - 1) {
            currentTrackIndex++;
        } else {
            currentTrackIndex = 0;
        }
        loadTrack(currentTrackIndex);
        playAudio();
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = progressPercent + '%';
        currentTimeElement.innerText = formatTime(currentTime);
    });

    audioPlayer.addEventListener('ended', () => {
        skipButton.click();
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
        progress.style.width = (clickX / width) * 100 + '%'; 
    });

    progressBar.addEventListener('mousemove', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const width = rect.width;
        const duration = audioPlayer.duration;
        const hoverTimeValue = (hoverX / width) * duration;
        hoverTime.style.left = `${hoverX}px`;
        hoverTime.innerText = formatTime(hoverTimeValue);
        hoverTime.style.display = 'block';
    });

    progressBar.addEventListener('mouseout', () => {
        hoverTime.style.display = 'none';
    });

    function populateTracklist() {
        tracklistContainer.innerHTML = window.trackList.map((track, index) => `
            <div class="track" onclick="playTrack(${index})" data-index="${index}">
                <img src="${window.albumCover}" alt="${track.name}">
                <div class="track-details">
                    <div class="track-name-list">${index + 1}. ${track.name}</div>
                    <div class="track-artist-list">${track.artist}</div>
                </div>
            </div>
        `).join('');
    }

    window.addEventListener('load', () => {
        loadingMessage.style.display = 'none';
        playerContainer.style.display = 'block';
        loadTrack(currentTrackIndex);
        populateTracklist();
    });
});
