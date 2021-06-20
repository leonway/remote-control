const EventEmitter = require('events')
const peer = new EventEmitter()
const { ipcRenderer } = require('electron')
const pc = new window.RTCPeerConnection({})
const dc = pc.createDataChannel('robotchannel', { reliable: false })
dc.onopen = () => {
  peer.on('robot', (type, data) => {
    dc.send(JSON.stringify({ type, data }))
  })
}
dc.onmessage = (e) => {
  console.log('dc message', e)
}
dc.onerror = (e) => {
  console.log('dc error', e)
}
// onicecandidate iceEvent
// addIceCandidate
pc.onicecandidate = function (e) {
  console.log('onicecandidate', e.candidate)
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
  }
}

pc.onicecandidateerror = (...data) => {
  console.log('onicecandidateerror,,,', data)
}

async function createOffer(params) {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  })
  await pc.setLocalDescription(offer)
  console.log('create-offer\n', JSON.stringify(pc.localDescription))
  return pc.localDescription
}
createOffer().then((offer) => {
  // console.log('forward', 'offer', offer)
  ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp })
})
ipcRenderer.on('answer', (e, answer) => {
  setRemote(answer)
})
ipcRenderer.on('candidate', (e, candidate) => {
  // console.log("ipcRenderer.on('candidate', (e, candidate)", e, candidate, typeof candidate)
  addIceCandidate(candidate)
})
async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
  console.log('create-answer', pc)
}
window.setRemote = setRemote

let candidates = []
async function addIceCandidate(candidate) {
  candidate = typeof candidate === 'string' ? JSON.parse(candidate) : candidate
  console.log('addIceCandidate', candidate, candidate.type)
  if (!candidate) return
  candidates.push(candidate)
  // console.log('pc.remoteDescription', pc.remoteDescription, candidates)
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      const element = candidates[i]
      // console.log('for...addIceCandidate... candidate', element, typeof element)
      await pc.addIceCandidate(new RTCIceCandidate(element))
    }
    candidates = []
  }
}
window.addIceCandidate = addIceCandidate

pc.onaddstream = function (e) {
  console.log('add-stream', e.stream)
  peer.emit('add-stream', e.stream)
}
module.exports = peer
