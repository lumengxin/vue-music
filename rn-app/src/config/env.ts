export const APP_CONFIG = {
  // mock: 离线可运行；proxy: 走你自己的后端代理（处理 QQ 接口的跨域/Referer 限制）
  // apiMode: 'mock' as 'mock' | 'proxy',
  apiMode: 'proxy',
  // Android 模拟器通常使用 10.0.2.2；真机请改成电脑局域网 IP
  // apiBaseUrl: 'http://10.0.2.2:3000/api',
  apiBaseUrl: 'http://192.168.145.124:3000/api'
};
