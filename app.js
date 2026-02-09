// app.js - Using ES Modules
// app.js - New import for local bundling
import Calendar from './calendar-library.mjs';

document.addEventListener('DOMContentLoaded', function () {
    // ... the rest of your existing calendar setup code remains the same
    const calendarEl = document.getElementById('calendar');
    const calendar = new Calendar(calendarEl, {
        defaultView: 'month',
        calendars: [

            {
                id: 'alberts-events',
                name: "Albert's List",
                color: '#ffffff',
                bgColor: '#9e5fff',
                borderColor: '#9e5fff'
            }
        ]
    });
    calendar.createEvents([
        {
            id: 'event1',
            calendarId: 'alberts-events',
            title: 'Sample Event from Eventbrite',
            category: 'time',
            start: '2025-12-25T10:00:00', // Changed to a future date for visibility
            end: '2025-12-25T12:00:00',
        }
    ]);
});
