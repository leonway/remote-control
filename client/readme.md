## tips

### 编译原生模块（robotjs）

#### 手动编译

npm rebuild --runtime=electron --disturl=https://atom.io/download/atom-shell --target=12.0.5 --abi=7
process.versions.electron,可以看到 electron 版本
process.versions.node 可以看到 node 版本，之后再 abi——crosswalk 查找 api

#### electron-rebuild

npm install electron-rebuild
npx electron-rebuild
