// Selectors

// Calendar
const month = document.querySelector("#month");
const year = document.querySelector("#year");
const todayBtn = document.querySelector("#todayBtn");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const daysOfMonth = document.querySelectorAll("#daysOfMonth")[0].children;
const calendar = document.querySelector("#dayNums");
// New event selectors
const newEventModal = document.querySelector(".new-event");
const newEventBg = document.querySelector(".new-event-bg");
const newEventBtn = document.querySelector("#addNew");
const closeBtnNew = document.querySelector(".close-new");
const createEvent = document.querySelector("#createEvent");
const inputsNew = document.querySelectorAll(".input-new");
// View event selectors
const closeBtnView = document.querySelector(".close-view");
const editEventIcon = document.querySelector(".fa-edit");
const viewEventModal = document.querySelector(".view-event");
const viewFields = document.querySelectorAll(".view");
const keyFields = document.querySelectorAll(".view-key");
// Edit event selectors
const editEventModal = document.querySelector(".edit-event");
const closeBtnEdit = document.querySelector(".close-edit");
const inputsEdit = document.querySelectorAll(".input-edit");
const editEventBtn = document.querySelector("#editEvent");
const editEventBtnLink = document.querySelector("#editEventLink");
// Delete event selectors
const deleteIcon = document.querySelector(".delete-event-icon");
const deleteEventModal = document.querySelector(".delete-event");
const deleteMessage = document.querySelector(".delete-message");
const yesDeleteBtn = document.querySelector("#yesDelete");
const yesDeleteBtnLink = document.querySelector("#yesDeleteLink");
const noDeleteBtn = document.querySelector("#noDelete");
// Event success message
const eventSuccess = document.querySelector("#eventSuccess");
const eventSuccessMessage = document.querySelector("#eventSuccessMessage");


const currentDate = new Date(); // for current date (ex. return to today)
let currentDateString = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split("T")[0]; // currentDate in YYYYMMDD string format
let dateChange = new Date(); // for navigation through calendar

// Render month and year in heading function
renderHeading = (date) => {
    year.textContent = date.getFullYear();
    month.textContent = date.toLocaleString('en-us', { month: 'long' });
}

saveEvents = (events) => {
    localStorage.setItem("events", JSON.stringify(events));
}

getSavedEvents = () => {
    // // Check events from localStorage if intact
    // for(let i = 0; i < JSON.parse(localStorage.getItem("events")).length; i++) {

    // }

    const eventsJSON = localStorage.getItem("events");

    try {
        return eventsJSON ? JSON.parse(eventsJSON) : [];
    } catch (e) {
        return [];
    }
}

// Render calendar in grid
renderCalendar = (date, events) => {
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('en-us', { weekday: 'long' });
    let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (let i = 0; i < 42; i++) {
        calendar.children[i].innerHTML = "";
    }
    for (let i = 0; i < daysOfMonth.length; i++) {
        if (daysOfMonth[i].textContent === firstDay) {
            for (let d = 0; d < daysInMonth; d++) {
                calendar.children[i + d].innerHTML = `<p>${d + 1}</p>`;
            }
            break;
        }
    }
    updateCalendarEvents(currentMonthEvents(events));
}

// deleteEmptyCells = () => {
//     // from the 28 to the last cell in the calendar, check if the cell is empty. if it's empty, delete cell.
//     for (let i = 28; i <= 42; i++) {
//         if (calendar.children[i].innerHTML === "") {
//             calendar.removeChild(calendar.children[i]);
//         }
//     }
// }


// Set min date to startDate and endDate picker
function setMinDate(startDate, endDate) {
    startDate.setAttribute("min", currentDateString);
    startDate.addEventListener("change", () => {
        endDate.setAttribute("min", startDate.value);
    })
}

// Filter events of month on display (for speed sake)
function currentMonthEvents(events) {
    return events.filter(event => new Date(event.startDate).getMonth() === dateChange.getMonth());
}

// Updates the events of the month on the display
function updateCalendarEvents(events) {
    for (let i = 0; i < events.length; i++) {
        createEventInDOM(events[i]);
    }
}

function createEventInDOM(event) {
    // Check every day of dateChange month so that dateChange's date equals one the day written in the calendar
    for (let i = 1; i <= calendar.children.length; i++) {
        if (new Date(event.startDate).getDate() === parseInt(calendar.children[i].textContent, 10) && new Date(event.startDate).getFullYear() === dateChange.getFullYear()) {
            const eventCell = document.createElement("a");
            switch (event.type) {
                case "work":
                    eventCell.classList.add("work");
                    break;
                case "study":
                    eventCell.classList.add("study");
                    break;
                case "free-time":
                    eventCell.classList.add("free-time");
                    break;
                case "family":
                    eventCell.classList.add("family");
                    break;
                case "shopping":
                    eventCell.classList.add("shopping");
                    break;
                case "holiday":
                    eventCell.classList.add("holiday");
                    break;
            }
            eventCell.textContent = event.title;
            eventCell.setAttribute("href", `index.html#${event.id}`);
            eventCell.classList.add("event");
            calendar.children[i].appendChild(eventCell);
            break;
        }
    }
}

// Post new event
function postEvent(event) {
    dateChange = new Date(event.startDate);
    createEventInDOM(event);
    renderHeading(dateChange);
    renderCalendar(dateChange, events);
}


// Find clicked event
function findClickedEvent(e) {
    const hash = e.target.hash.substr(1);
    const clickedEvent = events.find(function (event) {
        return event.id === hash;
    })
    return clickedEvent;
}

// Get keys of clicked event (without ID)
function getKeys(clickedEvent) {
    const keys = Object.keys(clickedEvent);
    keys.splice(keys.length - 1, 1);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "startDate") {
            keys.splice(i, 1, "Start Date")
        } else if (keys[i] === "endDate") {
            keys.splice(i, 1, "End Date")
        }
    }
    return keys;
}

// Get properties of clicked event
function getProps(clickedEvent) {
    const properties = [];
    for (let property in clickedEvent) {
        if (clickedEvent.hasOwnProperty(property)) {
            properties.push(clickedEvent[property]);
        }
    }
    return properties;
}

// For every field, change it's contents to each specific key and property of the event
function changeFieldContent(keysList, propsList) {
    for (let i = 0; i < keysList.length; i++) {
        keyFields[i].textContent = keysList[i];
    }
    for (let i = 0; i < viewFields.length; i++) {
        // If event property is empty, write "Not specified"
        if (propsList[i] === "" || propsList[i][0] === "") {
            viewFields[i].textContent = "Not specified";
            // Edit content for attendees (array)
        } else if (Array.isArray(propsList[i])) {
            let attendees = '';
            for (let d = 0; d < propsList[i].length; d++) {
                attendees += propsList[i][d] + ', ';
            }
            viewFields[i].textContent = attendees.substring(0, attendees.length - 2);
            // Edit content for everything else
        } else {
            viewFields[i].textContent = propsList[i].replace(/,/g, ', ');
        }
    }
}

// Delete event
const deleteEvent = (id) => {
    const eventIndex = events.findIndex((event) => event.id === id);

    if (eventIndex > -1) {
        events.splice(eventIndex, 1)
    }
}

// de la startDate pana la endDate a evenimentului, sa puna a-uri goale de culoarea tipului evenimentului