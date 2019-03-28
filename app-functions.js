// Selectors
const month = document.querySelector("#month");
const year = document.querySelector("#year");
const todayBtn = document.querySelector("#todayBtn");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const daysOfMonth = document.querySelectorAll("#daysOfMonth")[0].children;
const calendar = document.querySelector("#dayNums");
const newEventModal = document.querySelector(".new-event");
const newEventBg = document.querySelector(".new-event-bg");
const newEventBtn = document.querySelector("#addNew");
const closeBtnNew = document.querySelector(".close-new");
const createEvent = document.querySelector("#createEvent");
const eventSuccessBubble = document.querySelector("#eventSuccess");
const inputsNew = document.querySelectorAll(".input");
const closeBtnView = document.querySelector(".close-view");
const viewEvent = document.querySelector(".view-event");
const viewFields = document.querySelectorAll(".view");
const keyFields = document.querySelectorAll(".view-key");

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
inputsNew[2].setAttribute("min", currentDateString);
inputsNew[2].addEventListener("change", () => {
    inputsNew[3].setAttribute("min", inputsNew[2].value);
})

// Filter events of month on display (for speed sake)
function currentMonthEvents(events) {
    return events.filter(event => new Date(event.startDate).getMonth() === dateChange.getMonth());
}

// Updates the events of the month on display
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

function postEvent(event) {
    dateChange = new Date(event.startDate);
    createEventInDOM(event);
    renderHeading(dateChange);
    renderCalendar(dateChange, events);
}

// View event
// function eventView(eventID) {
//     if (event.target.classList.contains("event")) {
//         const hash = event.target.hash.substr(1);
//         console.log(hash);
//     }

// }

// de la startDate pana la endDate a evenimentului, sa puna a-uri goale de culoarea tipului evenimentului