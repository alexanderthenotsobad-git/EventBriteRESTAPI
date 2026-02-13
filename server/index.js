import 'dotenv/config';
import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 8080;

// Your private token from Eventbrite - already working
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

app.use(express.static('../'));

// Fetch events from Eventbrite using private token
// Fetch events from Eventbrite using private token
app.get('/api/events', async (req, res) => {
  if (!EVENTBRITE_TOKEN) {
    return res.status(500).json({ error: 'Eventbrite token not configured' });
  }

  try {
    console.log('Fetching events from Eventbrite...');
    console.log('Using token:', EVENTBRITE_TOKEN.substring(0, 5) + '...');

    const eventsResponse = await axios.get('https://www.eventbriteapi.com/v3/users/me/owned_events/', {
      headers: { 'Authorization': `Bearer ${EVENTBRITE_TOKEN}` },
      params: {
        expand: 'venue,organizer',
        status: 'live'
      }
    });

    console.log('Eventbrite response status:', eventsResponse.status);
    console.log('Number of events found:', eventsResponse.data.events?.length || 0);

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
    console.error('=== EVENTBRITE API ERROR ===');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    console.error('=============================');

    res.status(500).json({
      error: 'Failed to fetch events',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});