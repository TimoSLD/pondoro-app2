let timerelement = document.createElement("div");
timerelement.id = "timer-element";
document.body.appendChild(timerelement);

let timerDisplay = document.createElement("div");
timerDisplay.id = "timer-display";
timerDisplay.textContent = "00:02"; // Initial timer display
timerelement.appendChild(timerDisplay);

let buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";
document.body.appendChild(buttonContainer);

let buttonInfo = [
    { text: "Start", action: startButtonAction },
    { text: "Restart", action: restartButtonAction },
    { text: "+1 Minute", action: addOneMinuteAction },
    { text: "+10 Minutes", action: addTenMinutesAction }
];

for (let i = 0; i < buttonInfo.length; i++) {
    let button = document.createElement("button");
    button.textContent = buttonInfo[i].text;
    button.classList.add("custom-button");

    button.onclick = buttonInfo[i].action;

    buttonContainer.appendChild(button);
}

let totalSeconds = 2;
let timerInterval;

function startButtonAction() {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimerDisplay, 1000); // Update every second
    }
}

function updateTimerDisplay() {
    if (totalSeconds > 0) {
        totalSeconds--;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        let formattedTime = `${padNumber(minutes)}:${padNumber(seconds)}`;
        timerDisplay.textContent = formattedTime;
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay.textContent = "00:00";
        alert("werktijd voorbij.")
    }
}


function padNumber(number) {
    return number.toString().padStart(2, "0");
}

function restartButtonAction() {
    alert("you clicked restart");
}

function addOneMinuteAction() {
    alert("you clicked +1 minute");
}

function addTenMinutesAction() {
    alert("you clicked +10 minutes");
}

