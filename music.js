//should loop audio, not tested if it works yet

var myAudio = document.createElement('audio');
myAudio.setAttribute('src', 'snd_music.mp3');
myAudio.play()
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();
