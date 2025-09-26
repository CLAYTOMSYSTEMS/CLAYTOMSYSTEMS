self.addEventListener("install", ()=>self.skipWaiting());
self.addEventListener("activate", ()=>self.clients.claim());
self.addEventListener('install',e=>self.skipWaiting()); self.addEventListener('fetch',()=>{});