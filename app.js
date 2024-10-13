// Data structure to store calories burned per day
let caloriesData = {};
const calorieGoal = 70000;

let existingCaloriesData = {
  "Monday, September 23, 2024": "2087",
  "Tuesday, September 24, 2024": "2349",
  "Wednesday, September 25, 2024": "1920",
  "Thursday, September 26, 2024": "1731",
  "Friday, September 27, 2024": "1848",
  "Saturday, September 28, 2024": "508",
  "Sunday, September 29, 2024": "514",
  "Monday, September 30, 2024": "1520",
  "Tuesday, October 1, 2024": "1550",
  "Wednesday, October 2, 2024": "2083",
  "Thursday, October 3, 2024": "1647",
  "Friday, October 4, 2024": "1228",
  "Saturday, October 5, 2024": "1618",
  "Sunday, October 6, 2024": "951",
  "Monday, October 7, 2024": "1756",
  "Tuesday, October 8, 2024": "2228",
  "Wednesday, October 9, 2024": "1945",
  "Thursday, October 10, 2024": "1225",
  "Friday, October 11, 2024": "2105",
};

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

// Check if localStorage is already populated, otherwise initialize it
if (
  !localStorage.getItem("pendingRewards") ||
  !localStorage.getItem("completedRewards") ||
  !localStorage.getItem("remainingRewards")
) {
  localStorage.setItem("pendingRewards", JSON.stringify(pending));
  localStorage.setItem("completedRewards", JSON.stringify(done));
  localStorage.setItem("remainingRewards", JSON.stringify(remaining));
}

if (!localStorage.getItem("caloriesData")) {
  localStorage.setItem("caloriesData", JSON.stringify(existingCaloriesData));
}

// Function to update the total calories burned and the remaining goal
function updateCalorieGoal() {
  // Sum the calories burned from all days
  let totalCaloriesBurned = Object.values(caloriesData).reduce(
    (total, calories) => total + Number(calories),
    0
  );

  let poundsLeft = Math.round((totalCaloriesBurned / 3500) * 10) / 10;

  // Calculate remaining calories to reach the goal
  let remainingCaloriesCalc = calorieGoal - totalCaloriesBurned;
  let remainingCalories = remainingCaloriesCalc.toLocaleString();

  // Update the H2 element with the total burned and the remaining to the goal
  let calorieGoalText = `Calories Burned: ${totalCaloriesBurned.toLocaleString()} / 70,000 (${remainingCalories} left)`;
  document.getElementById("calorieGoal").textContent = calorieGoalText;

  // Update progress bar
  let progressPercentage = (totalCaloriesBurned / calorieGoal) * 100;
  let progressBar = document.getElementById("progress-bar");
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.textContent = `${Math.round(progressPercentage)}%`;

  // Update the display on each date in the calendar if calories have been entered
  document.querySelectorAll(".day").forEach((dayDiv, index) => {
    let dayDate = dayDiv.title;
    if (caloriesData[dayDate]) {
      let caloriesDisplay = dayDiv.querySelector(".calories-display");
      caloriesDisplay.textContent = `${caloriesData[dayDate]}`;
    }
  });
  displayRemainingDays(remainingCaloriesCalc, poundsLeft);
}

// Function to calculate the number of days remaining from the 45 days
function calculateRemainingDays() {
  // Set the start date (September 22)
  let currentYear = new Date().getFullYear();
  let startDate = new Date(currentYear, 8, 22); // September is month 8 (0-indexed)

  // Get the current date
  let currentDate = new Date();

  // Calculate the difference in time (in milliseconds)
  let timeDifference = currentDate - startDate;

  // Convert the difference from milliseconds to days
  let daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Subtract the days passed from the total 45 days
  let remainingDays = 45 - daysPassed;

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
function displayRemainingDays(remainingCaloriesCalc, poundsLeft) {
  // Calculate the remaining days
  let remainingDays = calculateRemainingDays();
  let calsPerDay = remainingCaloriesCalc / remainingDays;

  // Update the P element with the remaining cals per day
  let remainingDaysText = `You've lost ${poundsLeft} pounds!<br><br> Burn ${Math.ceil(
    calsPerDay
  )} kcals/day to reach your goal.`;
  document.getElementById("info").innerHTML = remainingDaysText;
}

// Function to generate a 45-day calendar starting from September 22
function generate45DayCalendar() {
  // Create a date object for September 22 of the current year
  let currentYear = new Date().getFullYear();
  let startDate = new Date(currentYear, 8, 22); // September is month 8 (0-indexed)

  let daysInCalendar = 45;

  // Get calendar container
  let calendarContainer = document.getElementById("calendar");

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
  ).textContent = `Enter calories burned for: ${selectedDate}`;

  // Store the selected date and index in the modal's data attributes
  document
    .getElementById("calorieModal")
    .setAttribute("data-date", selectedDate);
  document
    .getElementById("calorieModal")
    .setAttribute("data-day-index", dayIndex);
}

// Function to close the modal
function closeModal() {
  document.getElementById("calorieModal").style.display = "none";
}

// Function to sum weekly calories based on start date
function weeklyTotals() {
  const ul = document.getElementById("weekly-totals");
  // Define the start and end of the week you are interested in (example: week of September 23-27, 2024)
  const startOfWeekOne = new Date("September 22, 2024");
  const endOfWeekOne = new Date("September 28, 2024");

  const startOfWeekTwo = new Date("September 29, 2024");
  const endOfWeekTwo = new Date("October 5, 2024");

  const startOfWeekThree = new Date("October 6, 2024");
  const endOfWeekThree = new Date("October 12, 2024");

  const startOfWeekFour = new Date("October 13, 2024");
  const endOfWeekFour = new Date("October 19, 2024");

  const startOfWeekFive = new Date("October 20, 2024");
  const endOfWeekFive = new Date("October 26, 2024");

  const startOfWeekSix = new Date("October 27, 2024");
  const endOfWeekSix = new Date("November 2, 2024");

  const startOfWeekSeven = new Date("November 3, 2024");
  const endOfWeekSeven = new Date("November 5, 2024");

  // Function to get values from the object for the specified week
  let weekOneResult = [0];
  let weekTwoResult = [0];
  let weekThreeResult = [0];
  let weekFourResult = [0];
  let weekFiveResult = [0];
  let weekSixResult = [0];
  let weekSevenResult = [0];

  for (const dateStr in caloriesData) {
    // Convert the string date in the object key to an actual Date object
    const currentDate = new Date(dateStr);

    // Check if the current date falls within the desired week
    if (currentDate >= startOfWeekOne && currentDate <= endOfWeekOne) {
      weekOneResult.push(caloriesData[dateStr]);
    } else if (currentDate >= startOfWeekTwo && currentDate <= endOfWeekTwo) {
      weekTwoResult.push(caloriesData[dateStr]);
    } else if (
      currentDate >= startOfWeekThree &&
      currentDate <= endOfWeekThree
    ) {
      weekThreeResult.push(caloriesData[dateStr]);
    } else if (currentDate >= startOfWeekFour && currentDate <= endOfWeekFour) {
      weekFourResult.push(caloriesData[dateStr]);
    } else if (currentDate >= startOfWeekFive && currentDate <= endOfWeekFive) {
      weekFiveResult.push(caloriesData[dateStr]);
    } else if (currentDate >= startOfWeekSix && currentDate <= endOfWeekSix) {
      weekSixResult.push(caloriesData[dateStr]);
    } else if (
      currentDate >= startOfWeekSeven &&
      currentDate <= endOfWeekSeven
    ) {
      weekSevenResult.push(caloriesData[dateStr]);
    }
  }

  let sumOne = weekOneResult
    .map((str) => parseInt(str))
    .reduce((acc, num) => acc + num);
  let sumTwo = weekTwoResult
    .map((str) => parseInt(str))
    .reduce((acc, num) => acc + num);
  let sumThree = weekThreeResult
    .map((str) => parseInt(str))
    .reduce((acc, num) => acc + num);
  let sumFour = weekFourResult
    .map((str) => parseInt(str))
    .reduce((acc, num) => acc + num);
  let sumFive = weekFiveResult
    .map((str) => parseInt(str))
    .reduce((acc, num) => acc + num);
  let sumSix = weekSixResult
    .map((str) => parseInt(str))
    .reduce((acc, num) => acc + num);
  let sumSeven = weekSevenResult
    .map((str) => parseInt(str))
    .reduce((acc, num) => acc + num);

  let totalsArray = [
    sumOne,
    sumTwo,
    sumThree,
    sumFour,
    sumFive,
    sumSix,
    sumSeven,
  ];
  // Output the filtered result

  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  for (let i = 0; i < totalsArray.length; i++) {
    let ulLi = document.createElement("li");
    // let weekNumber = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];
    ulLi.innerText = `Week ${i + 1}: ${totalsArray[i]} kcals (${(
      totalsArray[i] / 3500
    ).toFixed(1)} lbs)`;
    ul.appendChild(ulLi);
  }
}

// Function to submit calories for the selected date
function submitCalories() {
  // Get the selected date and day index from the modal
  let selectedDate = document
    .getElementById("calorieModal")
    .getAttribute("data-date");
  let dayIndex = document
    .getElementById("calorieModal")
    .getAttribute("data-day-index");

  // Get the entered calorie value
  let calories = document.getElementById("calories").value;

  if (calories && calories > 0) {
    // Store the calories burned for the selected date in the data structure
    caloriesData[selectedDate] = calories;

    // Save the updated data to localStorage
    saveCaloriesData();

    // Update the total calories burned and remaining goal
    updateCalorieGoal();
    weeklyTotals();

    // Count and update rewards
    countDaysGreaterThan1500();

    // Close the modal after submitting
    closeModal();

    // Optionally, reset the input field for future inputs
    document.getElementById("calories").value = "";
  } else if (calories && calories === "0") {
    // Handle calorie deletion
    delete caloriesData[selectedDate];
    saveCaloriesData();
    let dayDiv = document.querySelectorAll(".day")[dayIndex];
    let caloriesDisplay = dayDiv.querySelector(".calories-display");
    caloriesDisplay.textContent = "";
    updateCalorieGoal();
    weeklyTotals();

    // Count and update rewards
    countDaysGreaterThan1500();
    closeModal();
    document.getElementById("calories").value = "";
  } else {
    alert("Please enter a valid number of calories.");
  }
  console.log(caloriesData);
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
function countDaysGreaterThan1500() {
  // Get the number of days with calories greater than or equal to 1500 from caloriesData
  let daysCount = Object.entries(caloriesData).filter(
    ([date, calories]) => Number(calories) >= 1500
  ).length;

  console.log(
    `Total number of days with calories greater than or equal to 1500: ${daysCount}`
  );
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
  generate45DayCalendar();
  loadCaloriesData();
  weeklyTotals();
  countDaysGreaterThan1500();
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

  const totalEarned = countDaysGreaterThan1500();
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

  const daysOver1500 = countDaysGreaterThan1500();
  updatePendingRewards(daysOver1500);

  renderPendingList();
  setProgressRatio(
    completedRewards.length,
    pendingRewards.length + completedRewards.length
  );
  addNotificationBadge(pendingRewards.length);
}
