// Create timer elements
const timerElement = document.createElement("div");
timerElement.classList.add("timer");
document.body.appendChild(timerElement);

const timerDisplay = document.createElement("div");
timerDisplay.classList.add("timer__display");
timerDisplay.textContent = convertTimeToFormattedString(2 * 60);
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
        // Start the timer and update button text
        timerInterval = setInterval(updateTimerDisplay, 1000, startButton);
        startButton.textContent = "Pause";
    } else if (timerInterval && !isPaused) {
        // Pause the timer and update button text
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        startButton.textContent = "Resume";
    } else if (!timerInterval && isPaused) {
        // Resume the timer and update button text
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
        // Session has ended, handle break transition
        clearInterval(timerInterval);
        timerInterval = null;
        totalSeconds = 25 * 60;
        breakCounter = breakCounter += 1;

        // After 4 sessions, increase break time
        if (breakCounter > 3) {
            breakTime = 10 * 60;
        }

        // Update break counter display
        breakCounterElement.textContent = "Break counter: " + breakCounter;

        // Update and display break time
        currentBreakTime();

        // Show an alert for a brief period
        alertElement.style.display = "block";
        setTimeout(() => {
            alertElement.style.display = "none";
        }, 3000);

        // Enter the break mode and start break interval
        inBreak = true;
        breakInterval = setInterval(updateBreakTimer, 1000, startButton);
    } else {
        // Timer is running, decrease totalSeconds and update display
        restartButton.disabled = false;
        totalSeconds = totalSeconds -= 1;
        currentTime();
    }
}

// Function to convert a time in seconds to a formatted "MM:SS" string
function convertTimeToFormattedString(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${padNumber(minutes)}:${padNumber(seconds)}`;
}

// Function to pad a number with leading zeros
function padNumber(number) {
    return number.toString().padStart(2, "0");
}

/**
 * Updates the break timer, handles break end, and enables the "Start" button for the next session.
 * If the breakTime reaches 0, it clears the breakInterval, resets breakTime, exits break mode,
 * enables the "Start" button, and updates its text to "Start."
 * If the break is still ongoing, it decreases breakTime and updates the break time and current time displays in startButton.
 */
function updateBreakTimer() {
    // Disable the "Start" button during the break
    startButton.disabled = true;

    if (breakTime <= 0) {
        // Break has ended, reset break settings and enable the "Start" button
        clearInterval(breakInterval);
        breakInterval = null;
        breakTime = 5 * 60;
        inBreak = false;

        // Enable the "Start" button and set its text
        startButton.disabled = false;
        startButton.textContent = "Start";
    } else {
        // Break is ongoing, decrease breakTime and update displays
        breakTime = breakTime -= 1;
        currentBreakTime();
        currentTime();
    }
}

/**
 * Restarts the timer by clearing the interval, resetting totalSeconds to 0,
 * updating the "Start" button text, and displaying the initial time.
 */
function restartButtonAction() {
    // Clear the timer interval, reset totalSeconds, and update button text
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 0;
    startButton.textContent = "Start";

    // Display the initial time on the timer
    currentTime();
}

/**
 * Adds one minute to the timer's total duration and updates the timer display.
 */
function addOneMinuteAction() {
    // Increase the total duration by 60 seconds (1 minute)
    totalSeconds = totalSeconds += 60;

    // Display the initial time on the timer
    currentTime();
}

/**
 * Adds 10 minutes to the timer's total duration and updates the timer display.
 */
function addTenMinutesAction() {
    // Increase the total duration by 10 times 60 seconds (10 minutes)
    totalSeconds = totalSeconds += 10 * 60;

    // Display the initial time on the timer
    currentTime();
}

/**
 * Calculates and updates the current time displayed in the timer.
 * It calculates minutes and seconds from the total seconds and uses the
 * `convertTimeToFormattedString` function to format the time as "MM:SS".
 */
function currentTime() {
    // Calculate minutes and seconds from totalSeconds
    const formattedTime = convertTimeToFormattedString(totalSeconds);

    // Update the document title with the current time
    let currentTimeRemaining = formattedTime;
    document.title = `Pomodoro App - ${currentTimeRemaining}`;

    // Update the timer display with the formatted time
    timerDisplay.textContent = formattedTime;
}

/**
 * Calculates and updates the current break time displayed in the timer.
 * It calculates minutes and seconds from the breakTime and uses the
 * `convertTimeToFormattedString` function to format the time as "MM:SS".
 */
function currentBreakTime() {
    // Use the new function to format the break time as "MM:SS"
    const formattedBreakTime = convertTimeToFormattedString(breakTime);

    // Update the "Start" button text with the break time
    startButton.textContent = formattedBreakTime;

    // Set the alert title and text
    alertTitle.textContent = "Time is up!";
    alertText.textContent = "Take a break and start again after: " + formattedBreakTime + " mins";
}

// Initialize the timer display
currentTime();
