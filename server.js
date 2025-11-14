const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Dossiers potentiels selon la version d'Angular
const distDir = path.join(__dirname, 'dist', 'frontend');
const candidates = [
  path.join(distDir, 'browser', 'index.html'),
  path.join(distDir, 'index.html'),
];

// Trouve le vrai index.html
function findIndex() {
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const indexPath = findIndex();
const staticRoot = indexPath ? path.dirname(indexPath) : distDir;

app.use(compression());

// Sert exactement le dossier où se trouve index.html
app.use(express.static(staticRoot, { index: false }));

// Healthcheck
app.get('/healthz', (_req, res) => res.type('text/plain').send('ok'));

// Accueil
app.get('/', (_req, res) => {
  if (indexPath) return res.sendFile(indexPath);
  return res.status(500).type('text/plain').send('index.html missing');
});

// Fallback SPA (toutes les autres routes front → index)
app.get('*', (_req, res) => {
  if (indexPath) return res.sendFile(indexPath);
  return res.status(404).type('text/plain').send('not found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[BOOT] Listening on 0.0.0.0:${PORT}`);
  console.log(`[BOOT] staticRoot = ${staticRoot}`);
  console.log(`[BOOT] indexPath  = ${indexPath || 'NONE'}`);
});
