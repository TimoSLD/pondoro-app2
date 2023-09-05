const pomodoro = document.getElementById('pomodoro-app');

/**
 * Creates a new HTML element with specified classes, content, and event listener.
 *
 * @param {String} element - The type of HTML element to create.
 * @param {Array<String>} elementClasses - An array of CSS classes to add to the element.
 * @param {HTMLElement} parent - The parent element to append the new element to (optional).
 * @param {String} content - The inner content of the new element (optional).
 * @param {Function} event - The event listener function for the new element (optional).
 *
 * @returns {HTMLElement} - The newly created HTML element.
 */
function createElement(element, elementClasses, parent = null, content = null, event = null) {
    const newElement = document.createElement(element);

    for (const elementClass of elementClasses) {
        newElement.classList.add(elementClass);
    }

    if (content) newElement.innerHTML = content;

    if (parent) parent.append(newElement);

    newElement.addEventListener('click', event);

    return newElement;
}

const timerElement = createElement('div', ['timer'], pomodoro);
const timerDisplay = createElement('div', ['timer__display'], timerElement, convertTimeToFormattedString(2 * 60));
const buttonContainer = createElement('div', ['button-container'], timerElement);
const alertElement = createElement('div', ['alert', 'alert--hide'], pomodoro);
const alertTitle = createElement('h2', ['alert__title'], alertElement, "Time is up!");
const alertText = createElement('span', ['alert__text'], alertElement, "Take a break and relax.");

const startButton = createElement('button', ['timer__button-container__button'], buttonContainer, "start", startButtonAction);
const restartButton = createElement('button', ['timer__button-container__button'], buttonContainer, "restart", restartButtonAction);
const plusOneMinuteButton = createElement('button', ['timer__button-container__button'], buttonContainer, "+1 minute", addOneMinuteAction);
const plusTenMinutesButton = createElement('button', ['timer__button-container__button'], buttonContainer, "+10 minutes", addTenMinutesAction);

let totalSeconds = 25 * 60;
let timerInterval;
let breakCounter = 0;
let breakTime = 5 * 60;
let alertCooldown = breakTime-5;
let breakInterval;
let inBreak = false;
let isPaused = false;

const breakCounterElement = createElement('span', ['timer__counter'], timerElement, "Break counter: " + breakCounter);

/**
 * Handles the "Start/Pause/Resume" button click.
 * If the timer is not running and not paused, it starts the timer.
 * If the timer is running and not paused, it pauses the timer.
 * If the timer is not running and is paused, it resumes the timer.
 *
 * @returns {void}
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
 *
 * @returns {void}
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
        displayAlert(true)

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

function displayAlert(display) {
    console.log('cstatutus change')
    display ? alertElement.classList.remove('alert--hide') : alertElement.classList.add('alert--hide')
}

/**
 * Converts a time in seconds to a formatted string "MM:SS".
 *
 * @param {number} timeInSeconds - The time in seconds to convert.
 * @returns {string} - A formatted time string in "MM:SS" format.
 */
function convertTimeToFormattedString(timeInSeconds) {
    // Calculate minutes and seconds from the total time in seconds
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    // Format the time as "MM:SS" and return the result
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
 *
 * @returns {void}
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
        if (alertCooldown === breakTime) {
            displayAlert(false)
        }
        // Break is ongoing, decrease breakTime and update displays
        breakTime = breakTime -= 1;
        currentBreakTime();
        currentTime();
    }
}

/**
 * Restarts the timer by clearing the interval, resetting totalSeconds to 0,
 * updating the "Start" button text, and displaying the initial time.
 *
 * @returns {void}
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
 *
 * @returns {void}
 */
function addOneMinuteAction() {
    // Increase the total duration by 60 seconds (1 minute)
    totalSeconds = totalSeconds += 60;

    // Display the updated time on the timer
    currentTime();
}

/**
 * Adds 10 minutes to the timer's total duration and updates the timer display.
 *
 * @returns {void}
 */
function addTenMinutesAction() {
    // Increase the total duration by 10 times 60 seconds (10 minutes)
    totalSeconds = totalSeconds += 10 * 60;

    // Display the updated time on the timer
    currentTime();
}

/**
 * Calculates and updates the current time displayed in the timer.
 * It calculates minutes and seconds from the total seconds and uses the
 * `convertTimeToFormattedString` function to format the time as "MM:SS".
 *
 * @returns {void}
 */
function currentTime() {
    // Calculate minutes and seconds from totalSeconds
    const formattedTime = convertTimeToFormattedString(totalSeconds);

    // Update the document title with the current time
    document.title = `Pomodoro App - ${formattedTime}`;

    // Update the timer display with the formatted time
    timerDisplay.textContent = formattedTime;
}

/**
 * Calculates and updates the current break time displayed in the timer.
 * It calculates minutes and seconds from the breakTime and uses the
 * `convertTimeToFormattedString` function to format the time as "MM:SS".
 *
 * @returns {void}
 */
function currentBreakTime() {
    // To format the break time as "MM:SS"
    const formattedBreakTime = convertTimeToFormattedString(breakTime);

    // Update the "Start" button text with the break time
    startButton.textContent = formattedBreakTime;

    // Set the alert title and text
    alertTitle.textContent = "Time is up!";
    alertText.textContent = `Take a break and start again after: ${formattedBreakTime} mins`;
}

// Initialize the timer display
currentTime();
