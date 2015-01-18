/*jslint browser: true*/
var video, countdown, countdownElement, countdownInterval, buttons, photo, photoCanvas, photoContext, thumb, thumbCanvas, thumbContext, remainingPictures;
navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

function displayCam(stream) {
    'use strict';
    video.src = window.URL.createObjectURL(stream);
    buttons.style.display = 'block';
}

function displayError(error) {
    'use strict';
    document.getElementById('error').textContent = error;
    video.style.display = 'none';
}

function takePicture() {
    'use strict';
    var demiWidth = photoCanvas.width / 2,
        demiHeight = photoCanvas.height / 2;
    switch (remainingPictures) {
    case 4:
        photoContext.drawImage(video, 0, 0, demiWidth, demiHeight);
        break;
    case 3:
        photoContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, demiWidth, 0, demiWidth, demiHeight);
        break;
    case 2:
        photoContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, demiHeight, demiWidth, demiHeight);
        break;
    case 1:
        photoContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, demiWidth, demiHeight, demiWidth, demiHeight);
        break;
    }
    thumbContext.drawImage(video, 0, 0, thumbCanvas.width, thumbCanvas.height);
    thumb.setAttribute('src', thumbCanvas.toDataURL('image/jpeg'));
    thumb.style.display = 'block';
    remainingPictures -= 1;
    if (remainingPictures > 0) {
        startCountdown();
    } else {
        photo.setAttribute('src', photoCanvas.toDataURL('image/jpeg'));
        thumb.style.display = 'none';
        photo.style.display = 'block';
    }
}

function countdownNext() {
    'use strict';
    countdown -= 1;
    if (countdown === 0) {
        countdownElement.textContent = '';
        clearInterval(countdownInterval);
        takePicture();
    } else {
        countdownElement.textContent = countdown;
    }
}

function startCountdown() {
    'use strict';
    countdown = 4;
    countdownElement.textContent = countdown;
    countdownElement.style.display = 'block';
    countdownInterval = setInterval(countdownNext, 1000);
    buttons.style.display = 'none';
}

function startPictures() {
    'use strict';
    //Set canvas dimensions according to webcam
    photoCanvas.width = video.videoWidth * 2;
    photoCanvas.height = video.videoHeight * 2;
    thumbCanvas.width = video.videoWidth / 2;
    thumbCanvas.height = video.videoHeight / 2;
    remainingPictures = 4;
    startCountdown();
}

function init() {
    'use strict';
    video = document.getElementById('cam-video');
    countdownElement = document.getElementById('countdown');
    buttons = document.getElementById('buttons');
    photo = document.getElementById('photo');
    photoCanvas = document.getElementById('photo-canvas');
    photoContext = photoCanvas.getContext('2d');
    thumb = document.getElementById('thumb');
    thumbCanvas = document.getElementById('thumb-canvas');
    thumbContext = thumbCanvas.getContext('2d');
    navigator.getMedia(
        {
            video: true,
            audio: false
        },
        displayCam,
        displayError
    );
    document.getElementById('start-btn').addEventListener('click', startPictures, false);
}

window.addEventListener('load', init, false);
