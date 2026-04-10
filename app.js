// app.js - Simple version, uses global tui.Calendar from CDN
document.addEventListener('DOMContentLoaded', async function () {
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
        const response = await fetch('/api/events');
        const events = await response.json();

        if (events.length > 0) {
            // ✅ Use createEvents, NOT createSchedules
            calendar.createEvents(events);
            console.log(`Loaded ${events.length} events from API`);
        } else {
            console.log('No events found');
        }
    } catch (error) {
        console.error('Failed to load events:', error);
    }
});