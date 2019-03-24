const month = document.querySelector("#month");
const year = document.querySelector("#year");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const daysOfMonth = document.querySelectorAll("#daysOfMonth")[0].children;
const calendar = document.querySelector("#dayNums");
const newEventModal = document.querySelector(".new-event");
const newEventBg = document.querySelector(".new-event-bg");
const newEventBtn = document.querySelector("#addNew");


// RENDER HEADING
const currentDate = new Date(); // for current date (ex. return to today)
const dateChange = new Date(); // for navigation through calendar

renderHeading = () => {
    year.textContent = dateChange.getFullYear();
    month.textContent = dateChange.toLocaleString('en-us', { month: 'long' });
}

renderCalendar = () => {
    for (let i = 0; i < 42; i++) {
        calendar.children[i].innerHTML = "";
    }
    let firstDay = new Date(dateChange.getFullYear(), dateChange.getMonth(), 1).toLocaleString('en-us', { weekday: 'long' });
    let daysInMonth = new Date(dateChange.getFullYear(), dateChange.getMonth() + 1, 0).getDate();
    // Add days to calendar
    for (let i = 0; i < daysOfMonth.length; i++) {
        if (daysOfMonth[i].textContent === firstDay) {
            for (let d = 0; d < daysInMonth; d++) {
                calendar.children[i + d].innerHTML = `<p>${d + 1}</p>`;
            }
            break;
        }
    }
}

// Create cells in calendar
for (let i = 0; i < 42; i++) {
    var cell = document.createElement("div");
    cell.classList.add("day");
    calendar.appendChild(cell);
}

renderHeading();
renderCalendar();

next.addEventListener("click", function (event) {
    dateChange.setMonth(dateChange.getMonth() + 1);
    renderHeading();
    renderCalendar();
})

previous.addEventListener("click", function (event) {
    dateChange.setMonth(dateChange.getMonth() - 1);
    renderHeading();
    renderCalendar();
})

// EVENTS
class Event {
    constructor(title, startDate, endDate, location, description, type, attendees, id) {
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
        return parseInt((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
    }
}

const firstEvent = new Event("Workshop", Date.now())

newEventBtn.addEventListener("click", function (event) {
    newEventModal.classList.add("shown");
    newEventBg.classList.add("shown-bg");
});

newEventBg.addEventListener("click", function (event) {
    newEventModal.classList.remove("shown");
    newEventBg.classList.remove("shown-bg");
})


// Event types:
// Work, studying, free time, family, shopping, holiday


// END OF EVENT

// To do list:
// 1. Add UUID
