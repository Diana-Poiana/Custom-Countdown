// input container
const inputContainer = document.getElementById('input-container');
const formInput = document.getElementById('countdownForm');
const eventInput = document.getElementById('title');
const dateInput = document.getElementById('date-picker');

// countdown container
const countdownContainer = document.getElementById('countdown');
const countdownTitle = document.getElementById('countdown-title');
const countdownItems = document.querySelectorAll('.countdown-item');
const countdownResetButton = document.getElementById('countdown-button');

//complete container
const completeContainer = document.getElementById('complete');
const completeInfo = document.getElementById('complete-info');
const completeButton = document.getElementById('complete-button');

let eventName = '';
let eventDate = '';
let countdownValue = new Date;
let activeCountdown;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// minimum day - today's date
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// update countdown
function updateCountdown(e) {
  e.preventDefault();

  eventName = e.target[0].value;
  eventDate = e.target[1].value;
  savedCountdown = {
    name: eventName,
    date: eventDate
  };

  if (!eventDate) {
    alert('Please choose a date!');
  } else {
    updateDOM();
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
  }
}

function updateDOM() {
  activeCountdown = setInterval(() => {
    const todaysValue = new Date().getTime();
    countdownValue = new Date(eventDate).getTime();
    const remainingTime = countdownValue - todaysValue;
    const remainingDays = Math.floor(remainingTime / day);
    const remainingHours = Math.floor((remainingTime % day) / hour);
    const remainingMinutes = Math.floor((remainingTime % hour) / minute);
    const remainingSeconds = Math.floor((remainingTime % minute) / second);

    inputContainer.hidden = true;

    if (remainingTime < 0) {
      completeContainer.hidden = false;
      countdownContainer.hidden = true;
      clearInterval(activeCountdown);
      completeInfo.textContent = `${eventName} finished on ${eventDate}`;
    } else {
      inputContainer.hidden = true;
      completeContainer.hidden = true;
      eventInput.hidden = true;
      countdownContainer.hidden = false;

      countdownTitle.innerText = `${eventName}`;
      countdownItems[0].innerText = `${remainingDays}`;
      countdownItems[1].innerText = `${remainingHours}`;
      countdownItems[2].innerText = `${remainingMinutes}`;
      countdownItems[3].innerText = `${remainingSeconds}`;
    }
  }, second);
}

// reset 
function reset() {
  inputContainer.hidden = false;
  eventInput.hidden = false;
  eventName = '';
  eventDate = '';
  countdownContainer.hidden = true;
  completeContainer.hidden = true;

  clearInterval(activeCountdown);
  localStorage.removeItem('countdown');
}

// restore previous countdown
function restorePreviousCountDown() {
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    eventInput.hidden = true;
    countdownContainer.hidden = false;
    eventName = savedCountdown.name;
    eventDate = savedCountdown.date;
    countdownValue = new Date(eventDate).getTime();
    updateDOM();
  }
}

// event listeners
formInput.addEventListener('submit', updateCountdown);
countdownResetButton.addEventListener('click', reset);
completeButton.addEventListener('click', reset);

// check local storage
restorePreviousCountDown();
