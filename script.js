const image = document.querySelector('img');
const title = document.getElementById('title');
const artista = document.getElementById('artist');

const music = document.querySelector('audio');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playBtn = document.getElementById('play');

const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');

const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// music
const songs = [{
    name: 'jacinto-1',
    display: 'Electric Chill Machine',
    artist: 'Jacinto Design'
}, {
    name: 'jacinto-2',
    display: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design'
}, {
    name: 'jacinto-3',
    display: 'Goodnight, Disco Queen',
    artist: 'Jacinto Design'
}, {
    name: 'metric-1',
    display: 'Front Row (Remix)',
    artist: 'Metric / Jacinto Design'
}];

let isPlaying = false;

// Play
function playSong() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}
// pause
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

// Play or Pause 
playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong()
});

// Actualizar DOM
function loadSong(song) {
    // usando textContent automáticamente ignora reflujo o recarga 
    // de texto en caso de ser repetido, porque si se usa
    // innerText, éste siempre implica darle chamba al navegador.
    // asi que en este escenario, por cuestion de performance, se
    // debe usar textContext 
    title.textContent = song.display;
    artista.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

// Current Song
let songIndex = 0;

// Prev Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        // doy efecto circular a la lista
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next Song
function nextSong() {
    songIndex++;
    if (songIndex === songs.length) {
        // doy efecto circular a la lista
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}
// On Load - Select First song
loadSong(songs[songIndex]);

// Update progress Bar & Time
function updateProgressBar(e) {
    if (isPlaying) {
        const { duration, currentTime } = e.srcElement;
        // Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        if (duration) {
            durationEl.textContent = displayTime(duration);
        }
        currentTimeEl.textContent = displayTime(currentTime);
    }
}

// Calculate display
function displayTime(timeToCheck) {

    const durationMinutes = Math.floor(timeToCheck / 60);
    let durationSeconds = Math.floor(timeToCheck % 60);
    if (durationSeconds < 10) {
        durationSeconds = `0${durationSeconds}`;
    }
    return `${durationMinutes}:${durationSeconds}`;

}

// Set Progress Bar
function setProgressBar(e) {
    // e.srcElement seria el this!
    const width = this.clientWidth;
    const offsetX = e.offsetX;
    const { duration } = music;

    const porcentajeNuevo = Math.floor((offsetX / width) * 100);
    const nuevoTiempo = Math.floor((offsetX / width) * duration);

    music.currentTime = nuevoTiempo;
    progress.style.width = `${porcentajeNuevo}%`;
    currentTimeEl.textContent = displayTime(nuevoTiempo);
}

// Event Listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);