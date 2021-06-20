const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()

const ws = new WebSocket('ws://81.69.24.152:8010')

ws.on('open', () => {
  console.log('connect success')
})

ws.on('message', (message) => {
  let data = {}
  try {
    data = JSON.parse(message)
  } catch (e) {
    console.log('parse error', e)
  }
  signal.emit(data.event, data.data)
})

function send(event, data) {
  ws.send(JSON.stringify({ event, data }))
}

function invoke(event, data, answerEvent) {
  return new Promise((res, rej) => {
    send(event, data)
    signal.once(answerEvent, res)
    setTimeout(() => {
      rej('timeout')
    }, 5000)
  })
}

signal.send = send
signal.invoke = invoke

module.exports = signal
