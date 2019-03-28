const events = getSavedEvents();

// Create cells in calendar
for (let i = 0; i < 42; i++) {
    const cell = document.createElement("div");
    cell.classList.add("day");
    calendar.appendChild(cell);
}

// Initial render
renderHeading(currentDate);
renderCalendar(currentDate, events);


// Navigation
todayBtn.addEventListener("click", function () {
    dateChange = new Date(currentDate);
    renderHeading(currentDate);
    renderCalendar(currentDate, events);
})

next.addEventListener("click", function () {
    dateChange.setMonth(dateChange.getMonth() + 1);
    renderHeading(dateChange);
    renderCalendar(dateChange, events);
    // deleteEmptyCells();
})

previous.addEventListener("click", function () {
    dateChange.setMonth(dateChange.getMonth() - 1);
    renderHeading(dateChange);
    renderCalendar(dateChange, events);
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
        return parseInt((new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24));
    } // DOESN'T WORK!!!
}

newEventBtn.addEventListener("click", () => {
    newEventModal.classList.add("shown");
    newEventBg.classList.add("shown-bg");
    inputsNew.forEach(function (input) {
        input.value = "";
    })
});

closeBtnNew.addEventListener("click", () => {
    newEventModal.classList.remove("shown");
    newEventBg.classList.remove("shown-bg");
})

closeBtnView.addEventListener("click", () => {
    viewEvent.classList.remove("shown");
    newEventBg.classList.remove("shown-bg");
})

// Create new event
createEvent.addEventListener("click", function () {
    if (!(inputsNew[0].value === "") && !(inputsNew[2].value === "")) {
        const id = uuidv4();

        const newEvent = new Event(inputsNew[0].value, inputsNew[1].value, inputsNew[2].value, inputsNew[3].value, inputsNew[4].value, inputsNew[5].value, inputsNew[6].value.replace(/\s*,\s*/g, ",").split(","), id);

        events.push(newEvent);
        newEventModal.classList.remove("shown");
        newEventBg.classList.remove("shown-bg");
        eventSuccessBubble.classList.toggle("successAnimation");
        window.setTimeout(function () {
            eventSuccessBubble.classList.toggle("successAnimation");
        }, 2500);
        saveEvents(events);
        postEvent(newEvent);
    }
    newEventModal.addEventListener("submit", function (event) {
        event.preventDefault();
    })
})

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("event")) {
        const hash = e.target.hash.substr(1);
        const clickedEvent = events.find(function (event) {
            return event.id === hash;
        })
        // Get the keys and properties lists of the clickedEvent object
        const keys = Object.keys(clickedEvent);
        keys.splice(0, 1);
        keys.splice(keys.length - 1, 1);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === "startDate") {
                keys.splice(i, 1, "Start Date")
            } else if (keys[i] === "endDate") {
                keys.splice(i, 1, "End Date")
            }
        }
        const properties = [];
        for (let property in clickedEvent) {
            properties.push(clickedEvent[property]);
        }
        for (let i = 0; i < viewFields.length; i++) {
            // for every field, change it's contents to each specific key and property of the event
            // If event property if empty, write "Not specified"
            if (properties[i] === "" || properties[i][0] === "") {
                viewFields[i].textContent = "Not specified";
                // Edit content for attendees (array)
            } else if (Array.isArray(properties[i])) {
                let attendees = '';
                for (let d = 0; d < properties[i].length; d++) {
                    attendees += properties[i][d] + ', ';
                }
                viewFields[i].textContent = attendees.substring(0, attendees.length - 2);
                // Edit content for everything else
            } else {
                keyFields[i].textContent = keys[i];
                viewFields[i].textContent = properties[i].replace(/,/g, ', ');
            }
        }
        viewEvent.classList.add("shown");
        newEventBg.classList.add("shown-bg");
    }
});