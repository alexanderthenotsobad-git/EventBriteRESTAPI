// app.js - Calendar with navigation, title, and event click
let calendar;
let currentDate = new Date();
let allEvents = [];

document.addEventListener('DOMContentLoaded', async function () {
    calendar = new tui.Calendar('#calendar', {
        defaultView: 'month',
        usageStatistics: false,
        calendars: [{
            id: 'alberts-events',
            name: "Albert's List",
            backgroundColor: '#9e5fff',
            borderColor: '#9e5fff'
        }]
    });

    await loadAllEvents();
    updateMonthDisplay(currentDate);
    displayEventsForMonth(currentDate);

    document.getElementById('prevMonthBtn').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthDisplay(currentDate);
        calendar.setDate(currentDate);
        displayEventsForMonth(currentDate);
    });

    document.getElementById('nextMonthBtn').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthDisplay(currentDate);
        calendar.setDate(currentDate);
        displayEventsForMonth(currentDate);
    });

    calendar.render();

    // Attach click event listener to the calendar container
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.addEventListener('click', function (e) {
        const eventElement = e.target.closest('.toastui-calendar-event, .toastui-calendar-weekday-event, .toastui-calendar-event-time');
        if (eventElement) {
            const eventTitleElement = eventElement.querySelector('.toastui-calendar-event-title, .toastui-calendar-weekday-event-title');
            if (eventTitleElement) {
                let rawTitle = eventTitleElement.textContent.trim();
                // Remove time prefix like "07:00 " from the title
                const timePattern = /^\d{1,2}:\d{2}\s+/;
                const cleanTitle = rawTitle.replace(timePattern, '');

                const foundEvent = allEvents.find(ev => ev.title === cleanTitle);
                if (foundEvent) {
                    displayEventDetails(foundEvent);
                } else {
                    console.log('Event not found:', cleanTitle);
                }
            }
        }
    });
});

function updateMonthDisplay(date) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    monthYearDisplay.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

async function loadAllEvents() {
    try {
        const response = await fetch('/api/events');
        allEvents = await response.json();
        console.log(`Loaded ${allEvents.length} total events`);
    } catch (error) {
        console.error('Failed to load events:', error);
        allEvents = [];
    }
}

function displayEventsForMonth(date) {
    calendar.clear();

    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    const monthEvents = allEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getFullYear() === viewYear && eventDate.getMonth() === viewMonth;
    });

    if (monthEvents.length > 0) {
        calendar.createEvents(monthEvents);
        console.log(`Displayed ${monthEvents.length} events for ${date.toLocaleString('default', { month: 'long' })} ${viewYear}`);
    } else {
        console.log(`No events for ${date.toLocaleString('default', { month: 'long' })} ${viewYear}`);
    }
}

function displayEventDetails(event) {
    if (!event) return;

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const formattedStart = startDate.toLocaleString();
    const formattedEnd = endDate.toLocaleString();

    const modalHtml = `
        <div id="eventModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        ">
            <div style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
            ">
                <h2 style="margin-top: 0; color: #9e5fff;">${escapeHtml(event.title)}</h2>
                <p><strong>📅 Date:</strong> ${formattedStart} - ${formattedEnd}</p>
                ${event.location ? `<p><strong>📍 Location:</strong> ${escapeHtml(event.location)}</p>` : ''}
                ${event.description ? `<p><strong>📝 Description:</strong><br>${escapeHtml(event.description)}</p>` : ''}
                <button id="closeModalBtn" style="
                    background: #9e5fff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 15px;
                ">Close</button>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('eventModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('eventModal').remove();
    });

    document.getElementById('eventModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('eventModal')) {
            document.getElementById('eventModal').remove();
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}