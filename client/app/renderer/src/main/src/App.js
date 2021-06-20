import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import { ipcRenderer, remote } from 'electron' // !直接用会报错 需要修改cra 配置通过react-app-rewired 修改默认webpack配置
// const { ipcRenderer } = window.require('electron') // 第一种引用的方法
import './peer-puppet.js'
const { Menu, MenuItem } = remote

function App() {
  const [remoteCode, setRemoteCode] = useState('')
  const [localCode, setLocalCode] = useState('')
  const [controlText, setControlText] = useState('')
  const login = async () => {
    // console.log('login start')
    let code = await ipcRenderer.invoke('login')
    // console.log('login end code', code)
    setLocalCode(code)
  }
  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlState)
    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState)
    }
  }, [])

  const startControl = (code) => {
    ipcRenderer.send('control', code)
  }

  const handleControlState = (e, name, type) => {
    console.log('handleControlState')
    let text = ''
    if (type === 1) {
      // 控制别人
      text = `正在远程控制${name}`
    } else if (type === 2) {
      // 被控制
      text = `被${name}控制中`
    }
    setControlText(text)
  }
  const handleContextMenu = (e) => {
    e.preventDefault()
    const menu = new Menu()
    menu.append(new MenuItem({ label: '复制', role: 'copy' }))
    menu.popup()
  }
  return (
    <div className="App">
      {controlText === '' ? (
        <>
          <div>
            你的控制码<span onContextMenu={(e) => handleContextMenu(e)}>{localCode}</span>
          </div>
          <input type="text" value={remoteCode} onChange={(e) => setRemoteCode(e.target.value)} />
          <br />
          <button onClick={() => startControl(remoteCode)}>确认</button>
        </>
      ) : (
        <div>{controlText}</div>
      )}
    </div>
  )
}

export default App
