// app.js - Simple version, uses global tui.Calendar from CDN
document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');

    // Create calendar with tui.Calendar global (from CDN script tag)
    const calendar = new tui.Calendar('#calendar', {
        defaultView: 'month',
        usageStatistics: false,
        calendars: [{
            id: 'alberts-events',
            name: "Albert's List",
            backgroundColor: '#9e5fff',
            borderColor: '#9e5fff'
        }]
    });

    calendar.render();

    try {
        // Fetch real events from your backend API
        const response = await fetch('/api/events');
        const events = await response.json();

        if (events.length > 0) {
            calendar.createEvents(events);
            console.log(`Loaded ${events.length} events from Eventbrite`);
        } else {
            console.log('No upcoming events found');
        }
    } catch (error) {
        console.error('Failed to load events:', error);

        // Fallback: Show sample event so calendar isn't empty
        const today = new Date();
        calendar.createEvents([{
            id: 'sample',
            calendarId: 'alberts-events',
            title: 'Sample Event (API offline)',
            category: 'time',
            start: today,
            end: new Date(today.getTime() + (2 * 60 * 60 * 1000)),
        }]);
    }
});