const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filterButtons = document.querySelectorAll('[name="filter"]');
let filter = null;

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
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
    if(filter === 'Red Effect') {
      pixels = redEffect(pixels);
    } else if (filter === 'RGB Split') {
      pixels = rgbSplit(pixels);
    } else if (filter === 'Green Screen') {
      pixels = greenScreen(pixels);
    }

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

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  for(let i = 0; i < pixels.data.length; i+=4) {
    let red = pixels.data[i + 0];
    let green = pixels.data[i + 1];
    let blue = pixels.data[i + 2];

    if(red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
        pixels.data[i + 3] = 0;
      }
  }

  return pixels;
}

filterButtons.forEach(button => {
  button.addEventListener('click', (e) => toggleFilter(e));
});

function toggleFilter(e) {
  filter = e.target.innerHTML;
}

// getVideo();

video.addEventListener('canplay', paintToCanvas);
