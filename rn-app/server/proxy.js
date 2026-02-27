const express = require('express');
const axios = require('axios');
const cors = require('cors');
const compression = require('compression');

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3000;
let requestSeq = 0;

const LEVEL_WEIGHT = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  off: 99
};

const ACTIVE_LEVEL = (() => {
  const raw = (process.env.LOG_LEVEL || 'info').toLowerCase();
  return LEVEL_WEIGHT[raw] ? raw : 'info';
})();

const LOG_PRETTY = process.env.LOG_PRETTY !== '0';
const LOG_COLOR = process.env.LOG_COLOR !== '0' && process.stdout.isTTY;

function now() {
  return new Date().toISOString();
}

function safeJSONStringify(input) {
  try {
    return JSON.stringify(input);
  } catch {
    return '"[unserializable]"';
  }
}

function shouldLog(level) {
  return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[ACTIVE_LEVEL];
}

function truncate(input, max = 500) {
  if (typeof input !== 'string') return input;
  return input.length > max ? `${input.slice(0, max)}...` : input;
}

function colorize(level, text) {
  if (!LOG_COLOR) return text;
  const map = {
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m'
  };
  const reset = '\x1b[0m';
  return `${map[level] || ''}${text}${reset}`;
}

function getRequestId(req) {
  return req.requestId || 'n/a';
}

function fmtReqId(req) {
  const id = getRequestId(req);
  if (typeof id === 'number') return `#${String(id).padStart(4, '0')}`;
  return `#${id}`;
}

function formatFields(fields = {}) {
  const keys = Object.keys(fields).filter((key) => fields[key] !== undefined);
  if (!keys.length) return '';
  const formatted = keys.map((key) => {
    const value = fields[key];
    const normalized = typeof value === 'string' ? value : safeJSONStringify(value);
    return `${key}=${truncate(normalized)}`;
  });
  return ` | ${formatted.join(' | ')}`;
}

function logLine(level, scope, message, fields) {
  if (!shouldLog(level)) return;
  if (LOG_PRETTY) {
    const ts = now();
    const lv = colorize(level, level.toUpperCase().padEnd(5, ' '));
    const sc = scope.padEnd(10, ' ');
    process.stdout.write(`${ts} ${lv} ${sc} ${message}${formatFields(fields)}\n`);
    return;
  }
  process.stdout.write(
    `${safeJSONStringify({
      ts: now(),
      level,
      scope,
      message,
      ...fields
    })}\n`
  );
}

function logRoute(req, phase, routePath, fields) {
  logLine('info', 'route', `${fmtReqId(req)} ${phase} ${req.method} ${routePath}`, fields);
}

app.use(cors());
app.use(express.json());
app.use(compression());
app.use((req, res, next) => {
  const requestId = ++requestSeq;
  const start = Date.now();
  req.requestId = requestId;
  logLine('info', 'api:in', `${fmtReqId(req)} ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    query: req.query
  });
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    logLine('info', 'api:out', `${fmtReqId(req)} ${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      cost: `${elapsed}ms`
    });
  });
  next();
});

function qqHeaders(host = 'c.y.qq.com', referer = 'https://c.y.qq.com/') {
  return {
    referer,
    host,
    origin: 'https://y.qq.com',
    'user-agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile'
  };
}

function parseJSONP(data) {
  if (typeof data !== 'string') return data;
  const reg = /^[^(]+\(([\s\S]+)\);?\s*$/;
  const matches = data.match(reg);
  if (!matches) return data;
  try {
    return JSON.parse(matches[1]);
  } catch {
    return data;
  }
}

function parseJSONIfPossible(data) {
  if (typeof data !== 'string') return data;
  const trimmed = data.trim();
  if (!trimmed) return data;
  if (!['{', '['].includes(trimmed[0])) return data;
  try {
    return JSON.parse(trimmed);
  } catch {
    return data;
  }
}

async function proxyQQ({ req, res, url, headers, jsonp = false }) {
  const startedAt = Date.now();
  logLine('debug', 'proxy:req', `${fmtReqId(req)} -> ${url}`, { query: req.query });
  try {
    const response = await axios.get(url, {
      headers,
      params: req.query,
      responseType: 'text',
      timeout: 15000
    });
    const elapsed = Date.now() - startedAt;
    logLine('info', 'proxy:res', `${fmtReqId(req)} <- ${url}`, {
      upstreamStatus: response.status,
      cost: `${elapsed}ms`
    });
    const data = jsonp ? parseJSONP(response.data) : parseJSONIfPossible(response.data);
    res.json(data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const elapsed = Date.now() - startedAt;
    logLine('error', 'proxy:err', `${fmtReqId(req)} <- ${url}`, {
      upstreamStatus: status,
      cost: `${elapsed}ms`,
      message: error?.message || 'proxy error'
    });
    res.status(status).json({
      code: status,
      message: error?.message || 'proxy error'
    });
  }
}

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'qq-music-proxy', ts: Date.now() });
});

function registerProxyRoute(routePath, options) {
  router.get(routePath, async (req, res) => {
    logRoute(req, 'start', routePath, { query: req.query });
    await proxyQQ({ req, res, ...options });
    logRoute(req, 'end', routePath);
  });
}

const proxyRouteConfigs = [
  {
    path: '/getRecommend',
    url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getDiscList',
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
    headers: qqHeaders()
  },
  {
    path: '/getRecSongInfo',
    url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getHotKey',
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getSearchInfo',
    url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getTopList',
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getRankSongList',
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getSingerList',
    url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getSingerDetail',
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/lyric',
    url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
    headers: qqHeaders(),
    jsonp: true
  },
  {
    path: '/getVKey',
    url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
    headers: qqHeaders(),
    jsonp: true
  }
];

proxyRouteConfigs.forEach(({ path, ...options }) => registerProxyRoute(path, options));

app.use('/api', router);

app.listen(PORT, () => {
  logLine('info', 'server', 'QQ music proxy listening', { url: `http://localhost:${PORT}`, level: ACTIVE_LEVEL });
});
