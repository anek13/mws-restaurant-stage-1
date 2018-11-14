var staticCacheName = 'restaurant-static-v1';
const cacheFiles = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  '/data/restaurants.json',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg'
]

//Install service worker and cache required assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(cacheFiles);
    })
  );
});

//Activate service worker and delete old cache
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
          cacheName != staticCacheName;
        }).map(function(cacheName) {
          return cache.delete(cacheName);
        })
      );
    })
  );
});

//Fetch requests and match with cache
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log('Found ', e.request, ' in cache');
        return response;
      }
      else {
        console.log('Could not find ', e.request, ' in a cache, FETCHING!');
        return fetch(e.request)
        .then(function(response) {
          const clonedResponse = response.clone();
          caches.open(staticCacheName).then(function(cache) {
            cache.put(e.request, clonedResponse);
          })
          return response;
        })
        .catch(function(err) {
          console.error(err);
        });
      }
    })
  );
})
