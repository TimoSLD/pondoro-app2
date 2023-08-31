let timerElement = document.createElement("div");
timerElement.id = "timer-element";
document.body.appendChild(timerElement);

let timerDisplay = document.createElement("div");
timerDisplay.id = "timer-display";
timerDisplay.textContent = "00:02"; // Initial timer display
timerElement.appendChild(timerDisplay);

let buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";
document.body.appendChild(buttonContainer);

let alertElement = document.createElement("div");
alertElement.id = "alert";
document.body.appendChild(alertElement);

let alertTitle = document.createElement("h2");
alertTitle.textContent = "Time is up!";
alertElement.appendChild(alertTitle);

let alertText = document.createElement("p");
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
    button.classList.add("custom-button");

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

let breakCounterElement = document.createElement("p");
breakCounterElement.textContent = "Break counter: " + breakCounter;
timerElement.appendChild(breakCounterElement);

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

function updateTimerDisplay() {
    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        totalSeconds = 2;
        timerDisplay.textContent = "00:02";
        breakCounter = breakCounter += 1;
        if (breakCounter > 3) {
            breakTime = 30 * 60;
        }
        breakCounterElement.textContent = "Break counter: " + breakCounter;

        alertTitle.textContent = "Time is up!";
        alertText.textContent = "Take a break and relax.";

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
    restartButton.disabled = true
    if (breakTime <= 0) {
        clearInterval(breakInterval);
        breakInterval = null;
        breakTime = 5;
        inBreak = false;
        startButton.disabled = false
        startButton.textContent = "Start";
    } else {
        breakTime = breakTime -= 1;
        let minutes = Math.floor(breakTime / 60);
        let seconds = breakTime % 60;
        let formattedBreakTime;
        formattedBreakTime = `${padNumber(minutes)}:${padNumber(seconds)}`;
        startButton.textContent = formattedBreakTime;
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
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let formattedTime;
    formattedTime= `${padNumber(minutes)}:${padNumber(seconds)}`;
    let currentTimeRemaining;
    currentTimeRemaining = formattedTime;
    document.title = `Pomodoro App - ${currentTimeRemaining}`;
    timerDisplay.textContent = formattedTime;
}

currentTime();
