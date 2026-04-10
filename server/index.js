import 'dotenv/config';
import express from 'express';
import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const app = express();
const PORT = 8080;

// ----- CSP MIDDLEWARE -----
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
// ----- END CSP MIDDLEWARE -----

// Serve static frontend files
app.use(express.static('../'));

// Fetch events from Apidog mock server
app.get('/api/events', async (req, res) => {
  try {
    console.log('🔍 Fetching events from Apidog mock server...');

    const mockResponse = await axios.get('https://mock.apidog.com/m1/1226630-1222810-default/events');

    console.log(`✅ Mock server returned ${mockResponse.data.length} events`);

    // The mock data is already in the format your frontend expects
    res.json(mockResponse.data);
  } catch (error) {
    console.error('❌ Mock API error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);

    res.status(500).json({
      error: 'Failed to fetch events from mock server',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📅 Test endpoint: http://localhost:${PORT}/api/events`);
});