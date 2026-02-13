import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 8080;

// Eventbrite OAuth credentials - you MUST set these as environment variables
const CLIENT_ID = process.env.EVENTBRITE_CLIENT_ID;
const CLIENT_SECRET = process.env.EVENTBRITE_CLIENT_SECRET;
const REDIRECT_URI = process.env.EVENTBRITE_REDIRECT_URI;

// In-memory token storage - REPLACE with Secret Manager in production
let accessToken = null;

app.use(express.static('../'));

// 1. Initiate OAuth flow
app.get('/auth/eventbrite', (req, res) => {
  const authUrl = 'https://www.eventbrite.com/oauth/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI
  });
  res.redirect(`${authUrl}?${params.toString()}`);
});

// 2. OAuth callback
app.get('/oauth/eventbrite/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const tokenResponse = await axios.post('https://www.eventbrite.com/oauth/token', {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    accessToken = tokenResponse.data.access_token;

    res.send('Eventbrite authentication successful! You can close this window.');
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

// 3. Fetch events from Eventbrite
app.get('/api/events', async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated with Eventbrite' });
  }

  try {
    const eventsResponse = await axios.get('https://www.eventbriteapi.com/v3/users/me/owned_events/', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: { expand: 'venue,organizer' }
    });

    // Transform Eventbrite events to TUI Calendar format
    const calendarEvents = eventsResponse.data.events.map(event => ({
      id: event.id,
      calendarId: 'alberts-events',
      title: event.name.text,
      category: 'time',
      start: event.start.utc,
      end: event.end.utc,
      location: event.venue?.name || 'Online',
      description: event.description?.text || ''
    }));

    res.json(calendarEvents);
  } catch (error) {
    console.error('Event fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});