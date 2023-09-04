const timerElement = document.createElement("div");
timerElement.classList.add("timer");
document.body.appendChild(timerElement);

const timerDisplay = document.createElement("div");
timerDisplay.classList.add("timer__display");
timerDisplay.textContent = "00:02";
timerElement.appendChild(timerDisplay);

const buttonContainer = document.createElement("div");
buttonContainer.classList.add("button-container");
document.body.appendChild(buttonContainer);

const alertElement = document.createElement("div");
alertElement.classList.add("alert");
document.body.appendChild(alertElement);

const alertTitle = document.createElement("h2");
alertTitle.classList.add("alert__title");
alertTitle.textContent = "Time is up!";
alertElement.appendChild(alertTitle);

const alertText = document.createElement("p");
alertText.classList.add("alert__text");
alertText.textContent = "Take a break and relax.";
alertElement.appendChild(alertText);

let buttonInfo = [
    { text: "Start", action: startButtonAction },
    { text: "Restart", action: restartButtonAction },
    { text: "+1 Minute", action: addOneMinuteAction },
    { text: "+10 Minutes", action: addTenMinutesAction }
];

let startButton;
let restartButton;

for (let i = 0; i < buttonInfo.length; i++) {
    let button = document.createElement("button");
    button.textContent = buttonInfo[i].text;
    button.classList.add("button-container__button");

    button.onclick = buttonInfo[i].action;

    buttonContainer.appendChild(button);

    if (buttonInfo[i].text === "Start") {
        startButton = button;
    } else if (buttonInfo[i].text === "Restart") {
        restartButton = button;
    }
}

let totalSeconds = 25 * 60;
let timerInterval;
let breakCounter = 0;
let breakTime = 5 * 60;
let breakInterval;
let inBreak = false;
let isPaused = false;

let breakCounterElement = document.createElement("span");
breakCounterElement.classList.add("timer__counter");
breakCounterElement.textContent = "Break counter: " + breakCounter;
timerElement.appendChild(breakCounterElement);

/**
 * Handles the "Start/Pause/Resume" button click.
 * If the timer is not running and not paused, it starts the timer.
 * If the timer is running and not paused, it pauses the timer.
 * If the timer is not running and is paused, it resumes the timer.
 */
function startButtonAction() {
    if (!timerInterval && !isPaused) {
        timerInterval = setInterval(updateTimerDisplay, 1000, startButton);
        startButton.textContent = "Pause";
    } else if (timerInterval && !isPaused) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        startButton.textContent = "Resume";
    } else if (!timerInterval && isPaused) {
        timerInterval = setInterval(updateTimerDisplay, 1000, startButton);
        isPaused = false;
        startButton.textContent = "Pause";
    }
}

/**
 * Updates the timer display.
 * If the totalSeconds reach 0, it clears the timerInterval, increments the break counter,
 * updates the break time and display, shows an alert, and starts a break interval.
 * If the timer is still running, it decreases totalSeconds and updates the current time display.
 */
function updateTimerDisplay() {
    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        totalSeconds = 25 * 60;
        breakCounter = breakCounter += 1;
        if (breakCounter > 3) {
            breakTime = 10 * 60;
        }
        breakCounterElement.textContent = "Break counter: " + breakCounter;

        currentBreakTime();

        alertElement.style.display = "block";
        setTimeout(() => {
            alertElement.style.display = "none";
        }, 3000);

        inBreak = true;
        breakInterval = setInterval(updateBreakTimer, 1000, startButton);
    } else {
        restartButton.disabled = false;
        totalSeconds = totalSeconds -= 1;
        currentTime();
    }
}

function updateBreakTimer() {
    startButton.disabled = true;
    if (breakTime <= 0) {
        clearInterval(breakInterval);
        breakInterval = null;
        breakTime = 5 * 60;
        inBreak = false;
        startButton.disabled = false
        startButton.textContent = "Start";
    } else {
        breakTime = breakTime -= 1;
        currentBreakTime();
        currentTime();
    }
}

function padNumber(number) {
    return number.toString().padStart(2, "0");
}

function restartButtonAction() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 0;
    startButton.textContent = "Start";
    currentTime();
}

function addOneMinuteAction() {
    totalSeconds = totalSeconds += 60;
    currentTime();
}

function addTenMinutesAction() {
    totalSeconds = totalSeconds += 10 * 60;
    currentTime();
}

function currentTime() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    let formattedTime;
    formattedTime= `${padNumber(minutes)}:${padNumber(seconds)}`;
    let currentTimeRemaining;
    currentTimeRemaining = formattedTime;
    document.title = `Pomodoro App - ${currentTimeRemaining}`;
    timerDisplay.textContent = formattedTime;
}

function currentBreakTime() {
    const minutes = Math.floor(breakTime / 60);
    const seconds = breakTime % 60;
    let formattedBreakTime;
    formattedBreakTime = `${padNumber(minutes)}:${padNumber(seconds)}`;
    startButton.textContent = formattedBreakTime;
    alertTitle.textContent = "Time is up!";
    alertText.textContent = "Take a break and start again after: " + `formattedBreakTime` + " mins";
}

currentTime();
