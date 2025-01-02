// Data structure to store calories burned per day
let caloriesData = {};
const calorieGoal = 70000;

// Create a date object for September 22 of the current year
let currentYear = new Date().getFullYear();
let startDate = new Date(2024, 11, 27); // September is month 8 (0-indexed)
let daysInCalendar = 40;

function initializeRewards() {
  const storedRewards = localStorage.getItem("remainingRewards");

  if (!storedRewards) {
    // Save `allRewards` to `remainingRewards` in localStorage
    localStorage.setItem("remainingRewards", JSON.stringify(allRewards));
  }
}

// Function to save caloriesData to localStorage
function saveCaloriesData() {
  localStorage.setItem("caloriesData", JSON.stringify(caloriesData));
}
// Function to load caloriesData from localStorage
function loadCaloriesData() {
  const storedData = localStorage.getItem("caloriesData");
  if (storedData) {
    caloriesData = JSON.parse(storedData);
    updateCalorieGoal();
  }
}

function updateCalorieGoal() {
  let daysLeft = calculateRemainingDays();
  let daysPassed = 41 - daysLeft;

  // Update the H2 element with the total burned and the remaining to the goal
  let calorieGoalText = `Day: ${daysPassed} / 40`;
  document.getElementById("calorieGoal").textContent = calorieGoalText;

  // Update progress bar
  let progressPercentage = (daysPassed / 40) * 100;
  let progressBar = document.getElementById("progress-bar");
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.textContent = `${Math.round(progressPercentage)}%`;

  // Update the display on each date in the calendar
  document.querySelectorAll(".day").forEach((dayDiv, index) => {
    let dayDate = dayDiv.title;

    if (caloriesData[dayDate]) {
      const { fast, chordii, pray } = caloriesData[dayDate];
      const fastMet = fast === true;
      const chordiiMet = chordii === true;
      const prayMet = pray === true;

      // Update the dots display
      let caloriesDisplay = dayDiv.querySelector(".calories-display");
      caloriesDisplay.innerHTML = `
        <span class="goal-dot ${fastMet ? "goal-met" : ""}"></span>
        <span class="goal-dot ${chordiiMet ? "goal-met" : ""}"></span>
        <span class="goal-dot ${prayMet ? "goal-met" : ""}"></span>
      `;
    }
  });

  // Calculate remaining days and update the info section
  displayRemainingDays();
}

// Function to calculate the number of days remaining from the 45 days
function calculateRemainingDays() {
  // Get the current date
  let currentDate = new Date();

  // Calculate the difference in time (in milliseconds)
  let timeDifference = currentDate - startDate;

  // Convert the difference from milliseconds to days
  let daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Subtract the days passed from the total 45 days
  let remainingDays = 40 - daysPassed;

  // Ensure remaining days is never less than 0 (in case the current date is beyond the 45-day period)
  return remainingDays > 0 ? remainingDays : 0;
}

function addNotificationBadge(days) {
  // Get the button element
  const rewardIcon = document.getElementById("reward-icon");
  const rewardCount = days;

  // Check if a badge already exists
  let badge = rewardIcon.querySelector(".notification-badge");

  if (rewardCount === 0) {
    // If count is zero, remove the badge if it exists
    if (badge) {
      rewardIcon.removeChild(badge);
    }
  } else {
    // If badge doesn't exist, create it
    if (!badge) {
      badge = document.createElement("div");
      badge.className = "notification-badge";
      rewardIcon.appendChild(badge);
    }
    // Update the badge text
    badge.textContent = rewardCount;
  }
}

// Function to display remaining days on the page
function displayRemainingDays() {
  // Calculate the remaining days
  let remainingDays = calculateRemainingDays();

  // Update the P element with the remaining cals per day
  let remainingDaysText = `${remainingDays} days left.<br><br> Keep going.`;
  document.getElementById("info").innerHTML = remainingDaysText;
}

function generate45DayCalendar() {
  // Get calendar container
  let calendarContainer = document.getElementById("calendar");
  calendarContainer.innerHTML = ""; // Clear any existing content

  // Calculate the day of the week for the start date
  let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Add empty slots for days before the start date
  for (let i = 0; i < startDayOfWeek; i++) {
    let emptyDiv = document.createElement("div");
    emptyDiv.className = "day empty";
    calendarContainer.appendChild(emptyDiv);
  }

  // Loop through 45 days
  for (let i = 0; i < daysInCalendar; i++) {
    // Create a new div for each day
    let dayDiv = document.createElement("div");
    dayDiv.className = "day";

    // Get the date for this iteration
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // Format the date conditionally
    let formattedDate;
    if (i === 0) {
      // First day should show month and day (e.g., "Sep 22")
      formattedDate = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (currentDate.getDate() === 1) {
      // First of each month should show only the month (e.g., "Oct")
      formattedDate = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      // All other days should show only the day (e.g., "23")
      formattedDate = currentDate.getDate();
    }

    // Set the text content to the formatted date
    dayDiv.textContent = formattedDate;

    // Add a calories display below the date (will update after input)
    let caloriesDisplay = document.createElement("div");
    caloriesDisplay.className = "calories-display";
    dayDiv.appendChild(caloriesDisplay);

    // Add tooltip using the title attribute with the full date (e.g., "September 22, 2024")
    dayDiv.title = currentDate.toLocaleDateString("en-US", {
      weekday: "long", // Full day of the week
      year: "numeric", // Full year
      month: "long", // Full month name
      day: "numeric", // Day of the month
    });

    // Add a click event listener to handle clicks on the date
    dayDiv.addEventListener("click", function () {
      openModal(dayDiv.title, i); // Pass the index for later use
    });

    // Append each day div to the calendar container
    calendarContainer.appendChild(dayDiv);
  }
}

// Function to open the modal and show the selected date
function openModal(selectedDate, dayIndex) {
  // Show the modal
  document.getElementById("calorieModal").style.display = "flex";

  // Set the modal date
  document.getElementById(
    "modalDate"
  ).textContent = `Enter values for: ${selectedDate}`;

  // Store the selected date and index in the modal's data attributes
  const modal = document.getElementById("calorieModal");
  modal.setAttribute("data-date", selectedDate);
  modal.setAttribute("data-day-index", dayIndex);

  // Check if there are existing values for the selected date
  if (caloriesData[selectedDate]) {
    const dayData = caloriesData[selectedDate];
    document.getElementById("fast").checked = dayData.fast || "";
    document.getElementById("chordii").checked = dayData.chordii || "";
    document.getElementById("pray").checked = dayData.pray || "";
  } else {
    // Clear the inputs if no data exists
    document.getElementById("fast").checked = "";
    document.getElementById("chordii").checked = "";
    document.getElementById("pray").checked = "";
  }
}

// Function to close the modal
function closeModal() {
  document.getElementById("calorieModal").style.display = "none";
}

function submitCalories() {
  // Get the selected date and day index from the modal
  let selectedDate = document
    .getElementById("calorieModal")
    .getAttribute("data-date");
  let dayIndex = document
    .getElementById("calorieModal")
    .getAttribute("data-day-index");

  let fast = document.getElementById("fast").checked;
  let chordii = document.getElementById("chordii").checked;
  let pray = document.getElementById("pray").checked;

  if (fast || chordii || pray) {
    caloriesData[selectedDate] = {
      fast: fast,
      chordii: chordii,
      pray: pray,
    };
    saveCaloriesData();
    updateCalorieGoal();
    updateSummary();

    // Update rewards and notification badge
    let daysMeetingCriteria = countDaysMeetingCriteria();
    updateRewardsBasedOnDays(daysMeetingCriteria);
    renderPendingList();

    // Update badge
    let pendingRewards =
      JSON.parse(localStorage.getItem("pendingRewards")) || [];
    addNotificationBadge(pendingRewards.length);

    closeModal();

    // Reset inputs
    document.getElementById("fast").checked = false;
    document.getElementById("chordii").checked = false;
    document.getElementById("pray").checked = false;
  } else if (caloriesData[selectedDate]) {
    // Remove data for this date
    delete caloriesData[selectedDate];
    saveCaloriesData();
    updateCalorieGoal();
    updateSummary();

    // Find the correct day div based on `selectedDate`
    let dayDiv = Array.from(document.querySelectorAll(".day")).find(
      (day) => day.getAttribute("title") === selectedDate
    );

    if (dayDiv) {
      let caloriesDisplay = dayDiv.querySelector(".calories-display");
      if (caloriesDisplay) {
        caloriesDisplay.innerHTML = ""; // Clear any displayed text
      } else {
        console.warn("calories-display element not found inside dayDiv.");
      }
    } else {
      console.error(`No matching day found for date: ${selectedDate}`);
    }
    closeModal();
  } else {
    alert("Please select at least one option or close the modal.");
  }
}

function updatePendingRewards(daysOver1500) {
  let pendingRewards = JSON.parse(localStorage.getItem("pendingRewards")) || [];
  let completedRewards =
    JSON.parse(localStorage.getItem("completedRewards")) || [];
  let remainingRewards =
    JSON.parse(localStorage.getItem("remainingRewards")) || [];

  let totalEarned = completedRewards.length + pendingRewards.length;

  if (daysOver1500 > totalEarned && remainingRewards.length > 0) {
    while (daysOver1500 > totalEarned && remainingRewards.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingRewards.length);
      const randomReward = remainingRewards.splice(randomIndex, 1)[0];
      if (randomReward) {
        pendingRewards.push(randomReward);
      }
      totalEarned++;
    }
  }

  localStorage.setItem("pendingRewards", JSON.stringify(pendingRewards));
  localStorage.setItem("remainingRewards", JSON.stringify(remainingRewards));

  renderPendingList();
}

// Attach event listeners for the modal buttons
document.getElementById("closeModal").addEventListener("click", closeModal);
document
  .getElementById("submitCalories")
  .addEventListener("click", submitCalories);

// Function to count all days with calories greater than or equal to 1500
function countDaysMeetingCriteria() {
  // Get the number of days with calories greater than or equal to 1500 from caloriesData
  let daysCount = Object.entries(caloriesData).filter(([date, values]) => {
    const fast = values.fast === true;
    const chordii = values.chordii === true;
    const pray = values.pray === true;

    return fast && chordii && pray;
  }).length;

  console.log(`Total number of days with all three goals: ${daysCount}`);
  updateRewardsBasedOnDays(daysCount); // New function to handle reward updates
  return daysCount;
}

function updateRewardsBasedOnDays(daysOver1500) {
  let pendingRewards = JSON.parse(localStorage.getItem("pendingRewards")) || [];
  let completedRewards =
    JSON.parse(localStorage.getItem("completedRewards")) || [];
  let remainingRewards =
    JSON.parse(localStorage.getItem("remainingRewards")) || [];

  let totalEarned = completedRewards.length + pendingRewards.length;

  if (daysOver1500 > totalEarned && remainingRewards.length > 0) {
    // Add items from remaining to pending if more days qualify
    while (daysOver1500 > totalEarned && remainingRewards.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingRewards.length);
      const randomReward = remainingRewards.splice(randomIndex, 1)[0];
      if (randomReward) {
        pendingRewards.push(randomReward);
      }
      totalEarned++;
    }
  } else if (daysOver1500 < totalEarned) {
    // Remove items from pending if fewer days qualify
    while (totalEarned > daysOver1500 && pendingRewards.length > 0) {
      const removedReward = pendingRewards.pop();
      remainingRewards.push(removedReward);
      totalEarned--;
    }
  }

  localStorage.setItem("pendingRewards", JSON.stringify(pendingRewards));
  localStorage.setItem("remainingRewards", JSON.stringify(remainingRewards));

  // Update the notification badge, progress circle, and rewards list
  addNotificationBadge(pendingRewards.length);
  renderPendingList();
  setProgressRatio(completedRewards.length, daysOver1500);
}

// Load saved data from localStorage when the page loads
window.onload = function () {
  // Call this function during app initialization
  initializeRewards();
  generate45DayCalendar();
  loadCaloriesData();
  updateSummary();
  countDaysMeetingCriteria();
  let pendingRewards = JSON.parse(localStorage.getItem("pendingRewards")) || [];
  addNotificationBadge(pendingRewards.length);
};

// rewards menu
document.getElementById("reward-icon").addEventListener("click", function () {
  document.getElementById("menu").classList.add("open");
  let pendingRewards = JSON.parse(localStorage.getItem("pendingRewards")) || [];
  let completedRewards =
    JSON.parse(localStorage.getItem("completedRewards")) || [];
  let remainingRewards =
    JSON.parse(localStorage.getItem("remainingRewards")) || [];

  const totalEarned = countDaysMeetingCriteria();
  setProgressRatio(completedRewards.length, totalEarned);

  let difference = totalEarned - completedRewards.length;

  // Update notification badge
  addNotificationBadge(difference);

  updatePendingRewards(totalEarned);
});

// Update the renderPendingList function to include the checkmark click handler
function renderPendingList() {
  let rewardsList = document.getElementById("rewards-due");
  rewardsList.innerHTML = "";

  let currentPendingList =
    JSON.parse(localStorage.getItem("pendingRewards")) || [];

  currentPendingList.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}: ${item}`;

    // Create button
    const button = document.createElement("button");
    // Add SVG for checkmark
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#333">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>
    `;

    // Add click event listener to remove the li
    button.addEventListener("click", () => {
      handleCheckmarkClick(i);
    });

    // Append the button to the li
    li.appendChild(button);
    rewardsList.appendChild(li);
  });
}

document.getElementById("close-menu").addEventListener("click", function () {
  document.getElementById("menu").classList.remove("open");
});

function setProgressRatio(current, total) {
  const percent = (current / total) * 100;
  const progressCircle = document.querySelector(".progress-circle");
  const text = document.querySelector(".progress-text");

  progressCircle.style.background = `conic-gradient(#ffd300 0% ${percent}%, #e0e0e0 ${percent}% 100%)`;
  text.textContent = `${current}/${total}`;
}

function handleCheckmarkClick(itemIndex) {
  let pendingRewards = JSON.parse(localStorage.getItem("pendingRewards")) || [];
  let completedRewards =
    JSON.parse(localStorage.getItem("completedRewards")) || [];
  let remainingRewards =
    JSON.parse(localStorage.getItem("remainingRewards")) || [];

  const [removedItem] = pendingRewards.splice(itemIndex, 1);
  completedRewards.push(removedItem);

  localStorage.setItem("pendingRewards", JSON.stringify(pendingRewards));
  localStorage.setItem("completedRewards", JSON.stringify(completedRewards));

  const daysOver1500 = countDaysMeetingCriteria();
  updatePendingRewards(daysOver1500);

  renderPendingList();
  setProgressRatio(
    completedRewards.length,
    pendingRewards.length + completedRewards.length
  );
  addNotificationBadge(pendingRewards.length);
}

function updateSummary() {
  let totalDays = countDaysMeetingCriteria();
  let daysTracked = Object.entries(caloriesData).length;

  let fastCount = Object.entries(caloriesData).filter(([date, values]) => {
    const fast = values.fast === true;

    return fast;
  }).length;

  let chordiiCount = Object.entries(caloriesData).filter(([date, values]) => {
    const chordii = values.chordii === true;

    return chordii;
  }).length;

  let prayCount = Object.entries(caloriesData).filter(([date, values]) => {
    const pray = values.pray === true;

    return pray;
  }).length;

  // Update the summary paragraph
  const summaryElement = document.getElementById("summary");
  summaryElement.innerHTML = `<p>Fast:</p> <span>${fastCount} / ${daysTracked}</span>
  <p>Chordii:</p> <span>${chordiiCount} / ${daysTracked}</span>
  <p>Pray:</p> <span>${prayCount} / ${daysTracked}</span>`;
}
