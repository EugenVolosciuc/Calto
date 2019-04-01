// Get events from localStorage
const events = getSavedEvents();

// Set min date to date pickers
setMinDate(inputsNew[2], inputsNew[3]);
setMinDate(inputsEdit[2], inputsEdit[3]);

// Create cells in calendar
for (let i = 0; i < 42; i++) {
    const cell = document.createElement("div");
    cell.classList.add("day");
    cell.classList.add("day-border")
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

let clickedEvent = {};

////////////
// NEW EVENT
////////////

// Open new event modal
newEventBtn.addEventListener("click", () => {
    newEventModal.classList.add("shown");
    newEventBg.classList.add("shown-bg");
    inputsNew.forEach(function (input) {
        input.value = "";
    })
});

// Create new event
createEvent.addEventListener("click", function () {
    if (!(inputsNew[0].value === "") && !(inputsNew[2].value === "")) {
        const id = uuidv4();

        const newEvent = new Event(inputsNew[0].value, inputsNew[1].value, inputsNew[2].value, inputsNew[3].value, inputsNew[4].value, inputsNew[5].value, inputsNew[6].value.replace(/\s*,\s*/g, ",").split(","), id);

        events.push(newEvent);
        newEventModal.classList.remove("shown");
        newEventBg.classList.remove("shown-bg");
        eventSuccessMessage.textContent = "Event Created Successfully";
        eventSuccess.classList.toggle("successAnimation");
        window.setTimeout(function () {
            eventSuccess.classList.toggle("successAnimation");
        }, 2500);
        saveEvents(events);
        postEvent(newEvent);
    }
    newEventModal.addEventListener("submit", function (e) {
        e.preventDefault();
    })
})

// Close new event modal
closeBtnNew.addEventListener("click", () => {
    newEventModal.classList.remove("shown");
    newEventBg.classList.remove("shown-bg");
})

/////////////
// VIEW EVENT
/////////////

// View event details
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("event")) {
        clickedEvent = findClickedEvent(e);
        // Get the keys and properties lists of the clickedEvent object
        const keys = getKeys(clickedEvent);
        keys.splice(0, 1);
        const properties = getProps(clickedEvent);
        changeFieldContent(keys, properties);
        viewEventModal.classList.add("shown");
        newEventBg.classList.add("shown-bg");
        editEventBtnLink.setAttribute("href", `index.html#${clickedEvent.id}`);
        yesDeleteBtnLink.setAttribute("href", `index.html#${clickedEvent.id}`);
        properties.splice(properties.length - 1, 1);
        for (let i = 0; i < inputsEdit.length; i++) {
            inputsEdit[i].value = properties[i];
        }
    }
});

// Close view event modal
closeBtnView.addEventListener("click", () => {
    viewEventModal.classList.remove("shown");
    newEventBg.classList.remove("shown-bg");
})

/////////////
// EDIT EVENT
/////////////

// Open edit event modal
editEventIcon.addEventListener("click", () => {
    viewEventModal.classList.remove("shown");
    editEventModal.classList.add("shown");

})

// Post edited event
editEventBtn.addEventListener("click", function (e) {
    if (!(inputsEdit[0].value === "") && !(inputsEdit[2].value === "")) {
        clickedEvent.title = inputsEdit[0].value;
        clickedEvent.type = inputsEdit[1].value;
        clickedEvent.startDate = inputsEdit[2].value;
        clickedEvent.endDate = inputsEdit[3].value;
        clickedEvent.location = inputsEdit[4].value;
        clickedEvent.description = inputsEdit[5].value;
        clickedEvent.attendees = inputsEdit[6].value;
        saveEvents(events);
        renderHeading(dateChange);
        editEventModal.classList.remove("shown");
        newEventBg.classList.remove("shown-bg");
        eventSuccessMessage.textContent = "Event Edited Successfully"
        eventSuccess.classList.toggle("successAnimation");
        window.setTimeout(function () {
            eventSuccess.classList.toggle("successAnimation");
        }, 4000);
        renderCalendar(dateChange, events);
    }
    editEventModal.addEventListener("submit", function (e) {
        e.preventDefault();
    })
})

// Close edit event modal
closeBtnEdit.addEventListener("click", () => {
    editEventModal.classList.remove("shown");
    viewEventModal.classList.add("shown");
})

///////////////
// DELETE EVENT
///////////////

// Open delete event modal
deleteIcon.addEventListener("click", (e) => {
    deleteMessage.textContent = `Are you sure you want to delete this event: "${clickedEvent.title}"?`
    editEventModal.classList.remove("shown");
    deleteEventModal.classList.add("shown");
})

// Delete event
yesDeleteBtn.addEventListener("click", (e) => {
    deleteEvent(clickedEvent.id);
    saveEvents(events);
    eventSuccessMessage.textContent = "Event Deleted Successfully"
    eventSuccess.classList.toggle("successAnimation");
    window.setTimeout(function () {
        eventSuccess.classList.toggle("successAnimation");
    }, 2500);
    renderCalendar(dateChange, events);
    deleteEventModal.classList.remove("shown");
    newEventBg.classList.remove("shown-bg");
})

// Close delete event modal
noDeleteBtn.addEventListener("click", (e) => {
    deleteEventModal.classList.remove("shown");
    editEventModal.classList.add("shown");
})