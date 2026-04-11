// app.js - Calendar with navigation and title
let calendar;
let currentDate = new Date();
let allEvents = [];

document.addEventListener('DOMContentLoaded', async function () {
    // Initialize calendar
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

    // Load all events first
    await loadAllEvents();

    // Update month display
    updateMonthDisplay(currentDate);

    // Display events for current month
    displayEventsForMonth(currentDate);

    // Set up navigation buttons
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
    // Clear existing events
    calendar.clear();

    // Get year and month of current view (month is 0-indexed)
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    // Filter events that occur in the current month
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