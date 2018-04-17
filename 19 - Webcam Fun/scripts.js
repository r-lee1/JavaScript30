const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(err);
    });
}

function paintToCanvas(){
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    //take pixels out
    let pixels = ctx.getImageData(0, 0, width, height);

    //change pixels value
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.3;

    //put pixels back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  //take data out of the canvas
  const data = canvas.toDataURL('images/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'selfie_js30');
  link.innerHTML = `<img src="${data}" alt="Nice Selfie" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i] = pixels.data[i] + 100;
  }

  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i]; //RED
    pixels.data[i + 500] = pixels.data[i+1]; //GREEN
    pixels.data[i - 550] = pixels.data[i+2]; //BLUE
  }

  return pixels;
}


getVideo();

video.addEventListener('canplay', paintToCanvas);