// Data structure to store calories burned per day
let caloriesData = {};
const calorieGoal = 70000;

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

// Function to display remaining days on the page
function displayRemainingDays(remainingCaloriesCalc, poundsLeft) {
  // Calculate the remaining days
  let remainingDays = calculateRemainingDays();
  let calsPerDay = remainingCaloriesCalc / remainingDays;

  // Update the P element with the remaining cals per day
  let remainingDaysText = `You've lost ${poundsLeft} pounds! Keep burning ${Math.ceil(
    calsPerDay
  )} calories per day to reach your goal.`;
  document.getElementById("info").textContent = remainingDaysText;
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

    // Format the date (e.g., "Sep 22")
    let formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

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
    ulLi.innerText = `Week ${i + 1} Calories: ${totalsArray[i]} (${(
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

    // Find the corresponding day in the calendar and update the display
    let dayDiv = document.querySelectorAll(".day")[dayIndex];
    let caloriesDisplay = dayDiv.querySelector(".calories-display");
    caloriesDisplay.textContent = `${calories}`;

    // Update the total calories burned and remaining goal
    updateCalorieGoal();

    weeklyTotals();

    // Close the modal after submitting
    closeModal();

    // first way to get sum of week one calories
    // console.log(caloriesData);

    // let weekOne = [
    //   "Sunday, September 22, 2024",
    //   "Monday, September 23, 2024",
    //   "Tuesday, September 24, 2024",
    //   "Wednesday, September 25, 2024",
    //   "Thursday, September 26, 2024",
    //   "Friday, September 27, 2024",
    //   "Saturday, September 28, 2024",
    // ];
    // let weekOneSum = 0;

    // for (const date of weekOne) {
    //   if (caloriesData.hasOwnProperty(date)) {
    //     weekOneSum += parseInt(caloriesData[date]);
    //   }
    // }
    // console.log(weekOneSum);

    // Optionally, reset the input field for future inputs
    document.getElementById("calories").value = "";
  } else if (calories && calories === "0") {
    delete caloriesData[selectedDate];
    saveCaloriesData();
    let dayDiv = document.querySelectorAll(".day")[dayIndex];
    let caloriesDisplay = dayDiv.querySelector(".calories-display");
    caloriesDisplay.textContent = "";
    updateCalorieGoal();

    weeklyTotals();
    closeModal();
    document.getElementById("calories").value = "";
    console.log(caloriesData);
  } else {
    alert("Please enter a valid number of calories.");
  }
}

// Attach event listeners for the modal buttons
document.getElementById("closeModal").addEventListener("click", closeModal);
document
  .getElementById("submitCalories")
  .addEventListener("click", submitCalories);

// Load saved data from localStorage when the page loads
window.onload = function () {
  generate45DayCalendar();
  loadCaloriesData();
  weeklyTotals();
};
