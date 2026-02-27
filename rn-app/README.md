# React Native 重构版本（Android / iOS）

这个目录是基于现有 `vue-music` 的 React Native（Expo）重构版本，目标是让应用在 Android 和 iOS 上运行，并复用原项目的业务模型与状态逻辑。

## 已迁移内容

- 播放状态管理（播放队列、顺序/随机/单曲循环、当前歌曲、歌词状态）
- `expo-av` 真实音频播放（播放/暂停、切歌、进度、结束回调）
- 本地持久化（搜索历史、播放历史、收藏列表）`AsyncStorage`
- 推荐 / 歌手 / 排行 / 搜索 / 我的（用户中心）页面
- 歌单详情 / 榜单详情 / 歌手详情（统一详情页）
- 播放器页面、迷你播放器、播放列表弹层、添加歌曲弹层
- QQ 音乐接口适配层（`mock` / `proxy` 双模式）
- 独立 Node 代理服务（RN 可直接调用）

## 说明

- 默认 `mock` 模式可直接运行，用于验证 Android/iOS 端 UI、交互和音频播放链路。
- `proxy` 模式下可通过 `npm run proxy` 启动本目录自带代理服务。
- 原 Vue 的 `vr` 页面已保留 RN 页面入口，当前为占位实现（未接入 3D/VR 渲染）。

## 启动

```bash
cd rn-app
npm install
npm run start
```

## 启动代理服务（Proxy 模式）

```bash
cd rn-app
npm install
npm run proxy
```

## 运行到 Android / iOS

```bash
# Android
npm run android

# iOS（仅 macOS）
npm run ios
```

## 接入代理服务

编辑 `src/config/env.ts`：

- `apiMode: 'proxy'`
- `apiBaseUrl` 默认会自动跟随 Metro 调试主机（真机不必每次手改 IP）

如需手动指定，可在启动前设置环境变量：

```bash
EXPO_PUBLIC_API_BASE_URL=http://<你的电脑局域网IP>:3000/api npm run start
```

## 代理健康检查

启动代理后访问：

- `http://localhost:3000/api/health`

如果返回 `ok: true`，表示代理已启动。
