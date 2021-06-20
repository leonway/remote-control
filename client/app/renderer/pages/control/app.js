const peer = require('./peer-controls')

peer.on('add-stream', (stream) => {
  play(stream)
})

let video = document.getElementById('screen-video')
function play(stream) {
  console.log('play-stream', stream)
  video.srcObject = stream
  video.onloadedmetadata = function () {
    video.play()
  }
  video.onerror = function (e) {
    console.log('video.onerror', e)
  }
}

window.onkeydown = function (e) {
  // data {keyCode, meta, alt, ctrl, shift}
  let data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    control: e.ctrlKey,
    alt: e.altKey,
  }
  peer.emit('robot', 'key', data)
}

window.onmouseup = function (e) {
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  let data = {}
  data.clientX = e.clientX
  data.clientY = e.clientY
  data.video = {
    width: video.getBoundingClientRect().width,
    height: video.getBoundingClientRect().height,
  }
  peer.emit('robot', 'mouse', data)
}
