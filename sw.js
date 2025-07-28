// Torres del Paine PWA Service Worker
// Versión 1.0.0 - Optimizado para Samsung Galaxy S24

const CACHE_NAME = 'torres-paine-v1.0.0';
const STATIC_CACHE = 'torres-static-v1';
const DYNAMIC_CACHE = 'torres-dynamic-v1';
const API_CACHE = 'torres-api-v1';

// Archivos críticos para cachear offline
const STATIC_FILES = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/offline.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js'
];

// URLs que se pueden cachear dinámicamente
const CACHEABLE_DOMAINS = [
  'cdn.tailwindcss.com',
  'unpkg.com',
  'cdnjs.cloudflare.com'
];

// URLs de APIs que requieren manejo especial
const API_ENDPOINTS = [
  '/api/',
  'weather',
  'maps'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Torres del Paine SW: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cache de archivos estáticos
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Cacheando archivos estáticos');
        return cache.addAll(STATIC_FILES.map(url => {
          return new Request(url, {
            mode: 'cors',
            credentials: 'omit'
          });
        })).catch(error => {
          console.warn('⚠️ Error cacheando algunos archivos estáticos:', error);
          // Continuar con los archivos que sí se pudieron cachear
        });
      }),
      
      // Crear cache dinámico vacío
      caches.open(DYNAMIC_CACHE),
      caches.open(API_CACHE)
    ]).then(() => {
      console.log('✅ Torres del Paine SW: Instalación completa');
      return self.skipWaiting();
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Torres del Paine SW: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches obsoletos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
              console.log('🗑️ Eliminando cache obsoleto:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control inmediato de todas las páginas
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Torres del Paine SW: Activación completa');
    })
  );
});

// Interceptar todas las requests (estrategia híbrida)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar requests GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Estrategia para archivos estáticos (Cache First)
  if (isStaticFile(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Estrategia para APIs (Network First con fallback)
  if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Estrategia para recursos externos (Stale While Revalidate)
  if (isExternalResource(url)) {
    event.respondWith(handleExternalRequest(request));
    return;
  }
  
  // Estrategia por defecto (Network First)
  event.respondWith(handleDefaultRequest(request));
});

// Manejo de archivos estáticos (Cache First)
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no está en cache, intentar descargar
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Error en static request:', error);
    
    // Fallback para páginas HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      const fallbackResponse = await caches.match('/offline.html');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    return new Response('Contenido no disponible offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Manejo de APIs (Network First)
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Intentar network primero
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cachear respuesta exitosa
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    console.warn('🌐 API offline, usando cache:', request.url);
    
    // Fallback a cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Respuesta por defecto para APIs específicas
    return generateFallbackApiResponse(request);
  }
}

// Manejo de recursos externos (Stale While Revalidate)
async function handleExternalRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Devolver cache inmediatamente si existe
  if (cachedResponse) {
    // Actualizar cache en background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Ignorar errores de background update
    });
    
    return cachedResponse;
  }
  
  // Si no hay cache, intentar network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Recurso no disponible offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Manejo por defecto (Network First)
async function handleDefaultRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cachear solo respuestas exitosas
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback final
    if (request.headers.get('accept')?.includes('text/html')) {
      const fallbackResponse = await caches.match('/offline.html') || 
                              await caches.match('/index.html');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    return new Response('Contenido no disponible', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Generar respuestas fallback para APIs
function generateFallbackApiResponse(request) {
  const url = new URL(request.url);
  
  // API de clima
  if (url.pathname.includes('weather') || url.searchParams.has('weather')) {
    return new Response(JSON.stringify({
      temp: 8,
      condition: 'offline',
      wind: 45,
      description: 'Datos offline - última actualización',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Offline-Response': 'true'
      }
    });
  }
  
  // API de mapas
  if (url.pathname.includes('maps') || url.pathname.includes('location')) {
    return new Response(JSON.stringify({
      location: 'Torres del Paine, Chile',
      coordinates: [-73.0, -50.9],
      offline: true,
      message: 'Ubicación aproximada - GPS no disponible'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-Offline-Response': 'true'
      }
    });
  }
  
  // Respuesta genérica
  return new Response(JSON.stringify({
    error: 'API no disponible offline',
    offline: true,
    timestamp: new Date().toISOString()
  }), {
    status: 503,
    headers: { 
      'Content-Type': 'application/json',
      'X-Offline-Response': 'true'
    }
  });
}

// Helpers para clasificar requests
function isStaticFile(url) {
  const pathname = url.pathname;
  return pathname === '/' || 
         pathname.endsWith('.html') || 
         pathname.endsWith('.js') || 
         pathname.endsWith('.css') || 
         pathname.endsWith('.json') ||
         pathname.includes('/static/');
}

function isApiRequest(url) {
  return API_ENDPOINTS.some(endpoint => 
    url.pathname.includes(endpoint) || 
    url.searchParams.has(endpoint.replace('/', ''))
  );
}

function isExternalResource(url) {
  return CACHEABLE_DOMAINS.some(domain => 
    url.hostname.includes(domain)
  );
}

// Background Sync para cuando vuelva la conexión
self.addEventListener('sync', event => {
  console.log('🔄 Background sync activado:', event.tag);
  
  switch (event.tag) {
    case 'sync-offline-data':
      event.waitUntil(syncOfflineData());
      break;
    case 'sync-photos':
      event.waitUntil(syncPhotos());
      break;
    case 'sync-preferences':
      event.waitUntil(syncPreferences());
      break;
  }
});

// Sincronizar datos offline
async function syncOfflineData() {
  try {
    console.log('📤 Sincronizando datos offline...');
    
    // Obtener datos guardados offline (ejemplo con IndexedDB)
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      const syncPromises = offlineData.map(async (data) => {
        try {
          const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            await removeOfflineData(data.id);
            return { success: true, id: data.id };
          }
          
          throw new Error(`Sync failed: ${response.status}`);
        } catch (error) {
          console.error('❌ Error sincronizando item:', data.id, error);
          return { success: false, id: data.id, error };
        }
      });
      
      const results = await Promise.allSettled(syncPromises);
      const successful = results.filter(r => r.value?.success).length;
      
      console.log(`✅ Sincronización completa: ${successful}/${offlineData.length} exitosos`);
      
      // Notificar al usuario
      if (successful > 0) {
        await showNotification('Torres del Paine', {
          body: `${successful} elementos sincronizados exitosamente`,
          icon: '/icons/icon-192.png',
          badge: '/icons/badge-72.png',
          tag: 'sync-success'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
  }
}

// Sincronizar fotos
async function syncPhotos() {
  console.log('📸 Sincronizando fotos...');
  // Implementar sincronización de fotos
}

// Sincronizar preferencias
async function syncPreferences() {
  console.log('⚙️ Sincronizando preferencias...');
  // Implementar sincronización de configuración
}

// Push Notifications
self.addEventListener('push', event => {
  console.log('📱 Push notification recibida');
  
  let notificationData = {
    title: 'Torres del Paine',
    body: 'Nueva información disponible',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png'
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      notificationData.body = event.data.text();
    }
  }
  
  event.waitUntil(
    showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: Math.random()
      },
      actions: [
        {
          action: 'view',
          title: 'Ver',
          icon: '/icons/view.png'
        },
        {
          action: 'dismiss',
          title: 'Cerrar',
          icon: '/icons/close.png'
        }
      ]
    })
  );
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  switch (event.action) {
    case 'view':
      event.waitUntil(
        clients.openWindow('/?from=notification')
      );
      break;
    case 'dismiss':
      // Solo cerrar la notificación
      break;
    default:
      // Click en el cuerpo de la notificación
      event.waitUntil(
        clients.openWindow('/')
      );
  }
});

// Helper para mostrar notificaciones
async function showNotification(title, options) {
  try {
    await self.registration.showNotification(title, options);
  } catch (error) {
    console.error('❌ Error mostrando notificación:', error);
  }
}

// Helpers para manejo de datos offline (placeholder - implementar con IndexedDB)
async function getOfflineData() {
  // Implementar lectura desde IndexedDB
  return [];
}

async function removeOfflineData(id) {
  // Implementar eliminación desde IndexedDB
  console.log('🗑️ Eliminando data offline:', id);
}

// Manejo de errores global
self.addEventListener('error', event => {
  console.error('❌ SW Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('❌ SW Unhandled Rejection:', event.reason);
});

// Comunicación con la aplicación principal
self.addEventListener('message', event => {
  console.log('💬 Mensaje recibido en SW:', event.data);
  
  switch (event.data?.action) {
    case 'skipWaiting':
      self.skipWaiting();
      break;
    case 'clearCache':
      clearAllCaches();
      break;
    case 'getCacheStatus':
      getCacheStatus().then(status => {
        event.ports[0]?.postMessage(status);
      });
      break;
  }
});

// Limpiar todos los caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ Todos los caches eliminados');
  } catch (error) {
    console.error('❌ Error limpiando caches:', error);
  }
}

// Obtener estado de caches
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      status[cacheName] = keys.length;
    }
    
    return status;
  } catch (error) {
    console.error('❌ Error obteniendo estado de cache:', error);
    return {};
  }
}

console.log('🏔️ Torres del Paine Service Worker cargado - v1.0.0');
