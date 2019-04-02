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
let dateChange = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // for navigation through calendar

// Render month and year in heading
renderHeading = (date) => {
    year.textContent = date.getFullYear();
    month.textContent = date.toLocaleString('en-us', { month: 'long' });
}

saveEvents = (events) => {
    localStorage.setItem("events", JSON.stringify(events));
}

getSavedEvents = () => {
    const eventsJSON = localStorage.getItem("events");
    try {
        return eventsJSON ? JSON.parse(eventsJSON) : [];
    } catch (e) {
        return [];
    }
}

restoreEmptyCells = () => {
    for (let i = 0; i < 6; i++) {
        if (!(calendar.children[i].innerHTML === "")) {
            calendar.children[i].classList.remove("day-no-hover");
            calendar.children[i].classList.add("day");
            calendar.children[i].classList.add("day-border");
        }
    }
    for (let i = 28; i < 42; i++) {
        if (!(calendar.children[i].innerHTML === "")) {
            calendar.children[i].classList.remove("day-no-hover");
            calendar.children[i].classList.add("day");
            calendar.children[i].classList.add("day-border");
        }
    }
}

deleteEmptyCells = () => {
    for (let i = 0; i < 6; i++) {
        if (calendar.children[i].innerHTML === "") {
            calendar.children[i].classList.remove("day");
            calendar.children[i].classList.add("day-no-hover");
            calendar.children[i].classList.remove("day-border");
        }
    }
    for (let i = 28; i < 42; i++) {
        if (calendar.children[i].innerHTML === "") {
            calendar.children[i].classList.remove("day");
            calendar.children[i].classList.add("day-no-hover");
            calendar.children[i].classList.remove("day-border");
        }
    }
}

function styleCurrentDay(currentDate) {
    for (let i = 0; i < 41; i++) {
        if (calendar.children[i].firstChild !== null) {
            if (calendar.children[i].firstChild.textContent === `${currentDate.getDate()}` && month.textContent === currentDate.toLocaleString('en-us', { month: 'long' }) && year.textContent === `${currentDate.getFullYear()}`) {
                calendar.children[i].firstChild.classList.add("today");
            }
        }
    }
}

// Render calendar in grid
renderCalendar = (dateChange, events) => {
    let firstDay = new Date(dateChange.getFullYear(), dateChange.getMonth(), 1).toLocaleString('en-us', { weekday: 'long' });
    let daysInMonth = new Date(dateChange.getFullYear(), dateChange.getMonth() + 1, 0).getDate();
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
    styleCurrentDay(currentDate);
    restoreEmptyCells();
    deleteEmptyCells();
    updateCalendarEvents(currentMonthEvents(events));
}

// Set min date to startDate and endDate picker
function setMinDate(startDate, endDate) {
    startDate.setAttribute("min", currentDateString);
    startDate.addEventListener("change", () => {
        endDate.setAttribute("min", startDate.value);
    })
}

// Filter events of month on display
function currentMonthEvents(events) {
    return events.filter(event => new Date(event.startDate).getMonth() === dateChange.getMonth());
}

function updateCalendarEvents(events) {
    for (let i = 0; i < events.length; i++) {
        createEventInDOM(events[i]);
    }
}

function checkEventType(event, cell) {
    switch (event.type) {
        case "work":
            cell.classList.add("work");
            break;
        case "study":
            cell.classList.add("study");
            break;
        case "free-time":
            cell.classList.add("free-time");
            break;
        case "family":
            cell.classList.add("family");
            break;
        case "shopping":
            cell.classList.add("shopping");
            break;
        case "holiday":
            cell.classList.add("holiday");
            break;
    }
}


function getFirstOneDayEvent(iterator) {
    const oneDayEvents = Array.from(calendar.children[iterator].children).filter(event => event.classList.value.includes("one-day-event"));
    return oneDayEvents.pop();
}

function createSingleEvent(event, iterator) {
    const eventCell = document.createElement("a");
    checkEventType(event, eventCell);
    eventCell.textContent = event.title;
    eventCell.setAttribute("href", `index.html#${event.id}`);
    eventCell.classList.add("one-day-event");
    calendar.children[iterator].appendChild(eventCell);
}

function insertEvent(iterator, typeOfCell) {
    if (calendar.children[iterator].lastChild.classList.value.includes("one-day-event")) {
        calendar.children[iterator].insertBefore(typeOfCell, getFirstOneDayEvent(iterator));
    } else if (calendar.children[iterator].lastChild.classList.value.includes("one-day-event") && calendar.children[iterator].firstChild.classList.value.includes("long-event")) {
        calendar.children[iterator].insertBefore(typeOfCell, getFirstOneDayEvent(iterator));
    } else {
        calendar.children[iterator].appendChild(typeOfCell);
    }
}

function createStartEvent(event, iterator) {
    const eventCell = document.createElement("a");
    checkEventType(event, eventCell);
    eventCell.textContent = event.title;
    eventCell.setAttribute("href", `index.html#${event.id}`);
    eventCell.classList.add("long-event");
    eventCell.classList.add("event-start");
    insertEvent(iterator, eventCell);
}

function createContinueEvent(event, iterator) {
    const eventCellContinue = document.createElement("a");
    checkEventType(event, eventCellContinue);
    eventCellContinue.textContent = event.title;
    eventCellContinue.setAttribute("href", `index.html#${event.id}`);
    eventCellContinue.classList.add("long-event");
    eventCellContinue.classList.add("event-continue");
    insertEvent(iterator, eventCellContinue);
}

function createEndEvent(event, iterator) {
    const eventCellEnd = document.createElement("a");
    checkEventType(event, eventCellEnd);
    eventCellEnd.textContent = event.title;
    eventCellEnd.setAttribute("href", `index.html#${event.id}`);
    eventCellEnd.classList.add("long-event");
    eventCellEnd.classList.add("event-end");
    insertEvent(iterator, eventCellEnd);
}


function getMaxNumOfEvents(event) {
    const maxNumOfEvents = [];
    for (let d = new Date(event.startDate).getDate(); d <= new Date(event.endDate).getDate(); d++) {
        debugger
        maxNumOfEvents.push(calendar.children[d].children.length - 1);
    }
    return Math.max(...maxNumOfEvents);
}

// function createEmptyEventSpace(iterator, maxNumOfEvents) {
//     for (let d = 0; d < maxNumOfEvents - calendar.children[iterator].length; d++) {
//         const emptyEventSpace = document.createElement("a");
//         emptyEventSpace.classList.add("empty-space");
//         calendar.children[iterator].appendChild(emptyEventSpace);
//     }
// }

function createEventInDOM(event) {
    let startDate = new Date(event.startDate).getDate();
    let endDate = new Date(event.endDate).getDate();
    // Check every day of month so that dateChange's date equals one the day written in the calendar
    for (let i = 0; i < calendar.children.length; i++) {
        // const maxNumOfEvents = getMaxNumOfEvents(event);
        // createEmptyEventSpace(i, maxNumOfEvents);
        if (startDate === parseInt(calendar.children[i].textContent, 10) && new Date(event.startDate).getFullYear() === dateChange.getFullYear()) {
            // If event takes place only one day, apply specific styling
            if (event.endDate === "" || startDate === endDate) {
                createSingleEvent(event, i);
                // If it takes place more than one day, apply this styling
            } else if (endDate !== startDate) {
                // Check if the day written in the calendar equals the startDate
                if (parseInt(calendar.children[i].textContent, 10) === startDate) {
                    createStartEvent(event, i);
                }
            }
        }
        // Check if the day written in the calendar is between the startEvent and endEvent days 
        if ((parseInt(calendar.children[i].textContent, 10) > startDate && (parseInt(calendar.children[i].textContent, 10) < endDate) && new Date(event.startDate).getFullYear() === dateChange.getFullYear())) {
            createContinueEvent(event, i);
        }

        // Check if the day written in the calendar equals the end date
        if ((startDate - endDate) !== 0) {
            if (endDate === parseInt(calendar.children[i].textContent, 10) && new Date(event.startDate).getFullYear() === dateChange.getFullYear()) {
                createEndEvent(event, i);
            }
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