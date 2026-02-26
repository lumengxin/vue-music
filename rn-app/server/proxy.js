const express = require('express');
const axios = require('axios');
const cors = require('cors');
const compression = require('compression');

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(compression());

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
  try {
    const response = await axios.get(url, {
      headers,
      params: req.query,
      responseType: 'text',
      timeout: 15000
    });
    const data = jsonp ? parseJSONP(response.data) : parseJSONIfPossible(response.data);
    res.json(data);
  } catch (error) {
    const status = error?.response?.status || 500;
    res.status(status).json({
      code: status,
      message: error?.message || 'proxy error'
    });
  }
}

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'qq-music-proxy', ts: Date.now() });
});

router.get('/getRecommend', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getDiscList', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
    headers: qqHeaders()
  })
);

router.get('/getRecSongInfo', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getHotKey', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getSearchInfo', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getTopList', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getRankSongList', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getSingerList', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getSingerDetail', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/lyric', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

router.get('/getVKey', (req, res) =>
  proxyQQ({
    req,
    res,
    url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
    headers: qqHeaders(),
    jsonp: true
  })
);

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`QQ music proxy listening on http://localhost:${PORT}`);
});
