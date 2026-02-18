import 'dotenv/config';
import express from 'express';
import eventbritePkg from 'eventbrite';

const isDevelopment = process.env.NODE_ENV === 'development';
const eventbrite = eventbritePkg.default;
const app = express();
const PORT = 8080
const EVENTBRITE_TOKEN = "XHYVNU7I7YSF565FDQKB";
console.log('🔍 eventbrite type:', typeof eventbrite, 'is function?', typeof eventbrite === 'function');

// ----- CSP MIDDLEWARE (ADD THIS BLOCK) -----
if (isDevelopment) {
  // Disable CSP for local testing
  app.use((req, res, next) => {
    res.removeHeader("Content-Security-Policy");
    next();
  });
} else {
  // Proper CSP for production
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

// Fetch events from Eventbrite
app.get('/api/events', async (req, res) => {
  if (!EVENTBRITE_TOKEN) {
    console.error('❌ EVENTBRITE_TOKEN not configured in .env');
    return res.status(500).json({ error: 'Eventbrite token not configured' });
  }

  try {
    // Create Eventbrite SDK instance with your token
    const sdk = eventbrite({ token: EVENTBRITE_TOKEN });

    console.log('🔍 Fetching events from Eventbrite...');

    // Fetch events - using explicit user ID from your earlier test
    const eventsResponse = await sdk.request('/organizations/2992573527910/events/', {
      params: {
        expand: 'venue,organizer',
        status: 'live,started,ended'
      }
    });

    console.log(`✅ Found ${eventsResponse.events?.length || 0} events`);

    // Transform Eventbrite events to TUI Calendar format
    const calendarEvents = eventsResponse.events.map(event => ({
      id: event.id,
      calendarId: 'alberts-events',  // Make sure this matches your frontend calendarId
      title: event.name.text,
      category: 'time',
      start: event.start.utc,
      end: event.end.utc,
      location: event.venue?.name || 'Online',
      description: event.description?.text || ''
    }));

    res.json(calendarEvents);
  } catch (error) {
    console.error('❌ Eventbrite API error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);

    res.status(500).json({
      error: 'Failed to fetch events',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📅 Test endpoint: http://localhost:${PORT}/api/events`);
});