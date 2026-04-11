// app.js - Calendar with navigation, title, and event click (Android compatible)
let calendar;
let currentDate = new Date();
let allEvents = [];

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM loaded, initializing calendar...');

    try {
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

        await loadAllEvents();
        updateMonthDisplay(currentDate);
        displayEventsForMonth(currentDate);

        // Navigation buttons
        const prevBtn = document.getElementById('prevMonthBtn');
        const nextBtn = document.getElementById('nextMonthBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                currentDate.setMonth(currentDate.getMonth() - 1);
                updateMonthDisplay(currentDate);
                calendar.setDate(currentDate);
                displayEventsForMonth(currentDate);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                currentDate.setMonth(currentDate.getMonth() + 1);
                updateMonthDisplay(currentDate);
                calendar.setDate(currentDate);
                displayEventsForMonth(currentDate);
            });
        }

        calendar.render();

        // Add click listener to calendar container
        const calendarContainer = document.getElementById('calendar');
        if (calendarContainer) {
            calendarContainer.addEventListener('click', function (e) {
                console.log('Calendar clicked');
                // Look for event title in the clicked element or its parents
                let target = e.target;
                let eventTitle = null;

                // Traverse up to find element with event title
                while (target && target !== calendarContainer) {
                    // Check for title in various possible elements
                    const titleElement = target.querySelector('.toastui-calendar-event-title, .toastui-calendar-weekday-event-title');
                    if (titleElement) {
                        eventTitle = titleElement.textContent.trim();
                        break;
                    }
                    // Also check if the clicked element itself has the title
                    if (target.classList && (
                        target.classList.contains('toastui-calendar-event-title') ||
                        target.classList.contains('toastui-calendar-weekday-event-title')
                    )) {
                        eventTitle = target.textContent.trim();
                        break;
                    }
                    target = target.parentElement;
                }

                if (eventTitle) {
                    console.log('Raw event title:', eventTitle);
                    // Remove time prefix if present
                    const cleanTitle = eventTitle.replace(/^\d{1,2}:\d{2}\s+/, '');
                    console.log('Clean title:', cleanTitle);

                    const foundEvent = allEvents.find(ev => ev.title === cleanTitle);
                    if (foundEvent) {
                        displayEventDetails(foundEvent);
                    } else {
                        console.log('Event not found in data:', cleanTitle);
                        // Fallback: show alert with event name
                        alert('Event: ' + cleanTitle + '\n(Details loading...)');
                    }
                }
            });
        }
    } catch (error) {
        console.error('Calendar initialization error:', error);
    }
});

function updateMonthDisplay(date) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    if (monthYearDisplay) {
        monthYearDisplay.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
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
    if (!calendar) return;

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

    // Simple alert for Android testing (modal can be added later)
    let message = `Title: ${event.title}\n`;
    message += `Date: ${formattedStart} - ${formattedEnd}\n`;
    if (event.location) message += `Location: ${event.location}\n`;
    if (event.description) message += `Description: ${event.description}`;

    alert(message);
}