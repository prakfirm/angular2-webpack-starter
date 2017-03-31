// This file is intentionally without code.
/*
 *
 *  Air Horner
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* v2017-03-29-9:30AM */

/** Install a service worker **/
var CACHE_NAME = 'deals-encash-cache-merchant-v2017-03-29-9:30AM ';
var urlsToCache = [
    '/',
    '/assets/css/initial.css',
    '/assets/css/font-awesome.min.css',
    '/assets/fonts/FontAwesome.otf',
    '/assets/fonts/fontawesome-webfont.eot?v=4.7.0',
    '/assets/fonts/fontawesome-webfont.svg?v=4.7.0',
    '/assets/fonts/fontawesome-webfont.ttf?v=4.7.0',
    '/assets/fonts/fontawesome-webfont.woff?v=4.7.0',
    '/assets/fonts/fontawesome-webfont.woff2?v=4.7.0',
    '/assets/icon/favicon-16x16.png',
    '/assets/icon/favicon-32x32.png',
    '/assets/icon/favicon-96x96.png',
    '/assets/icon/android-icon-192x192.png',
    '/images/footer-logo.png'
];


self.addEventListener('install', function(event) {
    /* Perform install steps*/
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache.map(function(urlsToCache) {
                    return new Request(urlsToCache, { mode: 'no-cors' });
                })).then(function() {
                    console.log('All resources have been fetched and cached.');
                });
            })
    );
});


/** Cache and return requests **/

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                /*
                 IMPORTANT: Clone the request. A request is a stream and
                 can only be consumed once. Since we are consuming this
                 once by cache and once by the browser for fetch, we need
                 to clone the response.
                 */
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        /*
                         IMPORTANT: Clone the response. A response is a stream
                         and because we want the browser to consume the response
                         as well as the cache consuming the response, we need
                         to clone it so we have two streams.
                         */
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

/** Update a service worker **/
self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['deals-encash-cache-merchant-v2017-03-29-9:30AM '];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});