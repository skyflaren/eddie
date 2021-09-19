$(document).ready(() => {
    const musicContainer = document.getElementById('music-container');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const volUp = document.getElementById('volume-up');
    const volDown = document.getElementById('volume-down');

    const audio = document.getElementById('audio');
    const progress = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const title = document.getElementById('title');
    const cover = document.getElementById('cover');
    const currTime = document.querySelector('#currTime');
    const durTime = document.querySelector('#durTime');

    var userVolume = 1.0;

    // Song titles
    const songs = ['mysong', 'heart', 'mongoose'];

    // Keep track of song
    let songIndex = 0;

    // Initially load song details into DOM

    loadSong(songs[songIndex]);


    // Update song details
    function loadSong(song) {
    // title.innerText = song;
        audio.src =  GLOBAL_PATH + "static/media/" + song + ".mp3";
        console.log(audio.src);
        cover.src = GLOBAL_PATH + "static/img/" + songIndex + ".jpg";
        console.log(cover.src);

    }

    // Play song
    function playSong() {
        musicContainer.classList.add('play');
        playBtn.querySelector('i.fas').classList.remove('fa-play');
        playBtn.querySelector('i.fas').classList.add('fa-pause');
        audio.play();
    }

    // Pause song
    function pauseSong() {
        musicContainer.classList.remove('play');
        playBtn.querySelector('i.fas').classList.add('fa-play');
        playBtn.querySelector('i.fas').classList.remove('fa-pause');

        audio.pause();
    }

    function prevSong() {
        songIndex--;
      
        if (songIndex < 0) {
          songIndex = songs.length - 1;
        }
      
        loadSong(songs[songIndex]);
      
        playSong();
    }

    function nextSong() {
        songIndex++;
    
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        
        loadSong(songs[songIndex]);
        
        playSong();
    }
    

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;

        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }

    // Event listeners
    playBtn.addEventListener('click', () => {
        const isPlaying = musicContainer.classList.contains('play');

        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    function FadeAudio (e) {
        // Set the point in playback that fadeout begins. This is for a 2 second fade out.
        const { duration, currentTime } = e.srcElement;
        var fadePoint = duration - 2.5; 
    
        // Only fade if past the fade out point or not at zero already
        if ((currentTime >= fadePoint) && (audio.volume != 0.0)) {
            audio.volume = Math.max(audio.volume-0.1, 0.0);
        }
        if ((currentTime <= 2.5) && (audio.volume != 1.0)) {
            audio.volume = Math.min(audio.volume+0.1, userVolume);
        }
        console.log(audio.volume);
        console.log(userVolume);
    }

    function volumeUp() {
        userVolume = Math.min(userVolume+0.2, 1.0);
        audio.volume = userVolume;
    }

    function volumeDown() {
        userVolume = Math.max(userVolume-0.2, 0.0);
        audio.volume = userVolume;
    }

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    volUp.addEventListener('click', volumeUp);
    volDown.addEventListener('click', volumeDown);
    // Time/song update
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('timeupdate', FadeAudio);

    // Click on progress bar
    // progressContainer.addEventListener('click', setProgress);

    // Song ends
    audio.addEventListener('ended', nextSong);

    // Time of song
    audio.addEventListener('timeupdate',DurTime);

});