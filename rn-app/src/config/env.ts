import { NativeModules, Platform } from 'react-native';

type ApiMode = 'mock' | 'proxy';

function getMetroHost(): string | undefined {
  const scriptURL = (NativeModules as any)?.SourceCode?.scriptURL as string | undefined;
  if (!scriptURL) return undefined;
  const match = scriptURL.match(/^https?:\/\/([^/:]+)/i);
  return match?.[1];
}

function getDefaultProxyHost(): string {
  const metroHost = getMetroHost();
  if (metroHost && metroHost !== 'localhost') return metroHost;
  return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

const envMode = process.env.EXPO_PUBLIC_API_MODE as ApiMode | undefined;
const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

const apiMode: ApiMode = envMode === 'mock' ? 'mock' : 'proxy';
const apiBaseUrl = envBaseUrl
  ? normalizeBaseUrl(envBaseUrl)
  : `http://${getDefaultProxyHost()}:3000/api`;

export const APP_CONFIG = {
  // mock: 离线可运行；proxy: 走你自己的后端代理（处理 QQ 接口的跨域/Referer 限制）
  apiMode,
  // 默认自动跟随 Metro 主机（真机免手改 IP），也可用 EXPO_PUBLIC_API_BASE_URL 显式覆盖
  apiBaseUrl
};
