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
const closeBtn = document.querySelector(".close");
const createEvent = document.querySelector("#createEvent");
const eventSuccessBubble = document.querySelector("#eventSuccess");
const inputsNew = document.querySelectorAll(".input");

const currentDate = new Date(); // for current date (ex. return to today)
let currentDateString = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split("T")[0]; // currentDate in YYYYMMDD string format
const dateChange = new Date(); // for navigation through calendar

// Render month and year in heading function
renderHeading = (date) => {
    year.textContent = date.getFullYear();
    month.textContent = date.toLocaleString('en-us', { month: 'long' });
}

// Render calendar in grid function

renderCalendar = (date) => {
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
}

// deleteEmptyCells = () => {
//     // from the 28 to the last cell in the calendar, check if the cell is empty. if it's empty, delete cell.
//     for (let i = 28; i <= 42; i++) {
//         if (calendar.children[i].innerHTML === "") {
//             calendar.removeChild(calendar.children[i]);
//         }
//     }
// }

// Create cells in calendar
for (let i = 0; i < 42; i++) {
    var cell = document.createElement("div");
    cell.classList.add("day");
    calendar.appendChild(cell);
}

// Initial render
renderHeading(currentDate);
renderCalendar(currentDate);

// Navigation
todayBtn.addEventListener("click", function (event) {
    renderHeading(currentDate);
    renderCalendar(currentDate);
})

next.addEventListener("click", function (event) {
    dateChange.setMonth(dateChange.getMonth() + 1);
    renderHeading(dateChange);
    renderCalendar(dateChange);
    // deleteEmptyCells();
})

previous.addEventListener("click", function (event) {
    dateChange.setMonth(dateChange.getMonth() - 1);
    renderHeading(dateChange);
    renderCalendar(dateChange);
})

// EVENTS
class Event {
    constructor(title, type, startDate, endDate, location, description, attendees, id) {
        this.title = title;
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.description = description;
        this.attendees = attendees;
        this.id = id;
    }

    getDuration() {
        // if
        return parseInt((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
    }
}

const events = [];

const saveEvents = (events) => {
    localStorage.setItem("events", JSON.stringify(events));
}

createEvent.addEventListener("click", function () {
    if (!(inputsNew[0].value === "") && !(inputsNew[2].value === "")) {
        const id = uuidv4();
        events.push(new Event(inputsNew[0].value, inputsNew[1].value, inputsNew[2].value, inputsNew[3].value, inputsNew[4].value, inputsNew[5].value, inputsNew[6].value.replace(/\s*,\s*/g, ",").split(","), id));
        newEventModal.classList.remove("shown");
        newEventBg.classList.remove("shown-bg");
        eventSuccessBubble.classList.toggle("successAnimation");
        window.setTimeout(function () {
            eventSuccessBubble.classList.toggle("successAnimation");
        }, 2500);

        saveEvents(events);

    }
    newEventModal.addEventListener("submit", function (event) {
        event.preventDefault();
    })
})

newEventBtn.addEventListener("click", function (event) {
    newEventModal.classList.add("shown");
    newEventBg.classList.add("shown-bg");
});

closeBtn.addEventListener("click", function (event) {
    newEventModal.classList.remove("shown");
    newEventBg.classList.remove("shown-bg");
})

// Set min date to startDate and endDate picker
inputsNew[2].setAttribute("min", currentDateString);
inputsNew[2].addEventListener("change", function (event) {
    inputsNew[3].setAttribute("min", inputsNew[2].value);
})

// END OF EVENT

// To do list:
// 1. Add UUID - DONE
// 2. Set min to startDate and endDate in date picker - DONE
// 3. Take values from add new event input and store them in a new event instance - DONE
// 4. Implement today button logic - DONE
// 5. Add pop-up for new added event and close the add new event window - DONE
// 6. Add localStorage
// 7. daca luna are 31 zile sau mai putin si daca prima zi a lunii incepe vineri sau mai devreme, sa fie sters randul && daca prima zi a lunii e 1 si luna are 28 zile, atunci sa fie sterse doua randuri - tried it, something's not right
// 8. Make events appear in calendar
// 9. Create Edit Event Window
// 10. Make delete button
// 11. Change font in textarea
// 12. Style calendar better
// 13. (Optional) Implement new event types option