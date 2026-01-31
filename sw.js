// バージョン名を更新しました（これを変えるとブラウザが「新しい！」と認識して再読み込みします）
const CACHE_NAME = 'tree-survey-v3.0.1_voice_fix'; 
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'sw.js',
  // ▼▼▼ 今回追加した音声認識用のファイルをキャッシュリストに追加 ▼▼▼
  './voice_model/tf.min.js',
  './voice_model/speech-commands.min.js',
  './voice_model/model.json',
  './voice_model/metadata.json',
  './voice_model/weights.bin'  // ※スクショのファイル名に合わせています
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 今回のバージョン(v3.0.1...)以外はすべて削除してゴミ掃除する
          if (cacheName !== CACHE_NAME) {
             console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // まずネットワークに取りに行き、だめなら(オフラインなら)キャッシュを使う
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
