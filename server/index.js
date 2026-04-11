import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevelopment = process.env.NODE_ENV === 'development';
const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// CSP Middleware
if (isDevelopment) {
  app.use((req, res, next) => {
    res.removeHeader("Content-Security-Policy");
    next();
  });
} else {
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; style-src 'self' 'unsafe-inline' https://uicdn.toast.com; script-src 'self' 'unsafe-inline' https://uicdn.toast.com; font-src 'self' data:; img-src 'self' data: https:;"
    );
    next();
  });
}

// Serve static files from the parent directory (where index.html and app.js live)
// The __dirname is /app/server, so we go up one level to /app
app.use(express.static(path.join(__dirname, '..')));

// Explicit route for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API endpoint
app.get('/api/events', async (req, res) => {
  try {
    const mockResponse = await axios.get('https://mock.apidog.com/m1/1226630-1222810-default/events');
    res.json(mockResponse.data);
  } catch (error) {
    console.error('Mock API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Test endpoint: /api/events`);
});