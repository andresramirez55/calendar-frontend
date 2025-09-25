// Script para mantener el backend activo en Render
const https = require('https');

const BACKEND_URL = 'https://calendar-backend-4k8h.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutos

function pingBackend() {
  console.log(`🔄 Ping al backend: ${new Date().toISOString()}`);
  
  https.get(`${BACKEND_URL}/health`, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`✅ Backend respondió: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`📊 Respuesta: ${data}`);
      }
    });
  }).on('error', (err) => {
    console.error(`❌ Error al hacer ping: ${err.message}`);
  });
}

// Hacer ping inmediatamente
pingBackend();

// Hacer ping cada 10 minutos
setInterval(pingBackend, PING_INTERVAL);

console.log(`🚀 Keep-alive iniciado. Ping cada ${PING_INTERVAL / 1000 / 60} minutos`);
