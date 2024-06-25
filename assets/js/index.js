// 1.1
function printNumbers1(from, to, interval) {
  if (from > to) {
    throw RangeError("to must be more or equal to from");
  }
  let counter = from;
  const intervalId = setInterval(() => {
    if (counter <= to) {
      console.log(counter++);
    } else {
      clearInterval(intervalId);
    }
  }, interval);
}

// try {
//   printNumbers1(3, 8, 1000);
// } catch (e) {
//   confirm.log("err ->", e);
// }

// 1.2
function printNumbers2(from, to, interval) {
  if (from > to) {
    throw RangeError("to must be more or equal to from");
  }
  let counter = from;
  setTimeout(function run() {
    console.log(counter++);
    if (counter <= to) {
      setTimeout(run, interval);
    }
  }, interval);
}

try {
  printNumbers2(4, 11, 1000);
} catch (e) {
  confirm.log("err ->", e);
}

// 2
const dateTimeInput = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("#days");
const hoursEl = document.querySelector("#hours");
const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");

startBtn.disabled = true;
let chosenDate = null;
let timerId = 0;

flatpickr(dateTimeInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    chosenDate = new Date(selectedDates[0]);
    if (chosenDate.getTime() < Date.now()) {
      Notiflix.Notify.failure("Choose datetime in future!");
      startBtn.disabled = true;
    } else {
      Notiflix.Notify.success("Click start");
      startBtn.disabled = false;
    }
  },
});

startBtn.addEventListener("click", (event) => {
  startBtn.disabled = true;
  dateTimeInput.disabled = true;

  timerId = setInterval(() => {
    const timeToFinish = chosenDate.getTime() - Date.now();

    const { days, hours, minutes, seconds } = convertMs(timeToFinish);

    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);

    if (timeToFinish < 1000) {
      clearInterval(timerId);
      startBtn.disabled = false;
      dateTimeInput.disabled = false;
    }
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return `${value}`.padStart(2, "0");
}
