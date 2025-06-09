// Login Screen
const defaultPasscode = '206102';

function checkPasscode() {
  const passcodeInput = document.getElementById('passcode-input');
  const errorMessage = document.getElementById('error-message');
  const passcode = passcodeInput.value;

  if (passcode === defaultPasscode ) {
    // Hide login screen and show start screen 
    document.getElementById('login-screen').style.display = "none";
    document.getElementById('start-page').style.display = "block";
  } else {
    errorMessage.innerHTML = "Incorrect passcode. Please try again.";
  }
}
// Main section switched
function showSection(sectionId) {
  const startPage = document.getElementById('start-page');
  const main = document.getElementById('main-container');
  const nav = document.getElementById('main-nav');
  const calendar = document.getElementById('calendar-container');

  const allSections = document.querySelectorAll('main > section');
  allSections.forEach(section => {
    section.style.display = 'none';
  });

  if (calendar) {
    if (sectionId === 'calendar-container') {
      calendar.style.display = 'block';
      renderCalendar(); // <- YOUR FUNCTION
    } else {
      calendar.style.display = 'none';
    }
  }

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
  }

  if (sectionId !== 'start-page') {
    startPage.style.display = 'none';
    main.style.display = 'block';
    nav.style.display = 'block';
  } else {
    startPage.style.display = 'block';
    main.style.display = 'none';
    nav.style.display = 'none';
  }
}

// Sudoku game logic
const sudokuData = {
  easy: [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ],
  medium: [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ],
  hard: [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ]
};

let selectedNum, selectedTile;
let disableSelect = false;
let timeRemaining = 0;
let timer = null;
let timeChosen = null;
let difficultyChosen = null;

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const gameTimer = document.getElementById("game-timer");
  if (gameTimer) {
    gameTimer.textContent = `${String(minutes).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
  }
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateTimerDisplay(timeRemaining);
    } else {
      clearInterval(timer);
      alert("Time's up!");
    }
  }, 1000);
}

function clearPrevious() {
  const tiles = document.querySelectorAll(".main-grid-cell");
  tiles.forEach(tile => tile.remove());

  const numberContainer = document.getElementById("number-container");
  if (numberContainer) {
    [...numberContainer.children].forEach(n => n.classList.remove("selected"));
  }

  selectedTile = null;
  selectedNum = null;
}

function generateBoard(board) {
  clearPrevious();
  const boardElement = document.getElementById("board");
  let idCount = 0;

  for (let i = 0; i < 81; i++) {
    const tile = document.createElement("p");
    tile.id = "cell-" + idCount;
    tile.classList.add("main-grid-cell");

    if (board.charAt(i) !== "-") {
      tile.textContent = board.charAt(i);
      tile.classList.add("preset");
    } else {
      tile.addEventListener("click", () => {
        updateTile(tile);
        tile.textContent = selectedNum || "";
      });
    }

    if ((idCount + 1) % 9 === 3 || (idCount + 1) % 9 === 6) tile.classList.add("rightBorder");
    if ((idCount >= 18 && idCount < 27) || (idCount >= 45 && idCount < 54)) tile.classList.add("bottomBorder");

    boardElement.appendChild(tile);
    idCount++;
  }
}

function updateTile(tile) {
  if (selectedTile) selectedTile.classList.remove("selected");
  selectedTile = tile;
  tile.classList.add("selected");
}

function showSudoku() {
  document.getElementById("games-screen").style.display = "none";
  document.getElementById("sudoku-container").style.display = "block";
  resetSudokuState();
}

function goBack() {
  document.getElementById("sudoku-container").style.display = "none";
  document.getElementById("games-screen").style.display = "block";
  if (timer) clearInterval(timer);
}

function resetSudokuState() {
  difficultyChosen = null;
  timeChosen = null;
  const diff = document.querySelector("#sudoku-container .diff");
  const time = document.getElementById("time");
  if (diff) diff.classList.add("active");
  if (time) {
    time.style.display = "none";
    time.classList.remove("active");
  }

  const gameScreen = document.getElementById("game-screen");
  if (gameScreen) gameScreen.style.display = "none";

  const startScreen = document.getElementById("gm-start-screen");
  if (startScreen) startScreen.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  // Difficulty buttons
  ["btn-easy-lvl", "btn-medium-lvl", "btn-hard-lvl"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".diff .btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        difficultyChosen = id.split("-")[1];

        const diff = document.querySelector(".diff");
        const time = document.getElementById("time");
        if (diff) diff.classList.remove("active");
        if (time) {
          time.style.display = "flex";
          time.classList.add("active");
        }
      });
    }
  });

  // Time buttons
  ["btn-time-1", "btn-time-2", "btn-time-3"].forEach((id, idx) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#time .btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        timeChosen = [300, 600, 900][idx];
        updateTimerDisplay(timeChosen);
      });
    }
  });

  // Play button
  const playBtn = document.getElementById("btn-play");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (!difficultyChosen || !timeChosen) {
        alert("Please choose difficulty and time.");
        return;
      }

      const startScreen = document.getElementById("gm-start-screen");
      const gameScreen = document.getElementById("game-screen");
      if (startScreen) startScreen.classList.remove("active");
      if (gameScreen) gameScreen.style.display = "block";

      document.getElementById("game-level").textContent = difficultyChosen.toUpperCase();
      timeRemaining = timeChosen;
      startTimer();

      const board = sudokuData[difficultyChosen][0];
      generateBoard(board);
    });
  }

  // Number selection
  document.querySelectorAll("#number-container .number").forEach(number => {
    number.addEventListener("click", function() {
      document.querySelectorAll("#number-container .number").forEach(n => n.classList.remove("selected"));
      this.classList.add("selected");
      selectedNum = this.textContent;
    });
  });

  // Delete button
  const deleteBtn = document.getElementById("btn-delete");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (selectedTile) {
        selectedTile.textContent = "";
      }
    });
  }
});

// Dashboard 
function renderWeekCards() {
  const container = document.getElementById("week-cards");
  container.innerHTML = "";

  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 (Sun) to 6 (Sat)
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayIndex);

  for (let i = 0; i < 7; i++) {
    const dateObj = new Date(startOfWeek);
    dateObj.setDate(startOfWeek.getDate() + i);

    const card = document.createElement("div");
    card.classList.add("date-card");

    if (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    ) {
      card.classList.add("today");
    }

    const dayLetter = dayNames[dateObj.getDay()];
    const dayNumber = dateObj.getDate().toString().padStart(2, "0");

    card.innerHTML = `
      <div class="day-letter">${dayLetter}</div>
      <div class="day-number">${dayNumber}</div>
    `;

    container.appendChild(card);
  }
}

renderWeekCards();

function updateCardInfo() {
  const allData = JSON.parse(localStorage.getItem("taskData")) || [];
  const categories = ["work", "learning", "school", "personal"];

  categories.forEach(category => {
    const tasks = allData.filter(task => task.category === category);
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Find the right card-info for this category
    const cardInfo = document.querySelector(`.card-info.${category}`);
    if (cardInfo) {
      const totalElem = cardInfo.querySelector(".total-tasks");
      const progressBar = cardInfo.querySelector(".progress-bar-fill");
      const percentText = cardInfo.querySelector(".percent");

      if (totalElem) totalElem.textContent = `${total}`;
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (percentText) percentText.textContent = `${percent}% Completed`;
    }
  });
}

function updateProgressBarsFromTaskData() {
  const allData = JSON.parse(localStorage.getItem("taskData")) || [];
  const categories = ["work", "learning", "school", "personal"];

  categories.forEach(category => {
    const tasks = allData.filter(task => task.category === category);
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    const completedPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
    const pendingPercent = total === 0 ? 0 : Math.round((pending / total) * 100);

    // Update progress bars
    const completedBar = document.getElementById(`completed-bar-${category}`);
    const pendingBar = document.getElementById(`pending-bar-${category}`);
    const completedPercentSpan = document.getElementById(`completed-percent-${category}`);
    const pendingPercentSpan = document.getElementById(`pending-percent-${category}`);
    const totalTasksSpan = document.getElementById(`totalTasks-${category}`);

    if (completedBar) completedBar.style.width = `${completedPercent}%`;
    if (pendingBar) pendingBar.style.width = `${pendingPercent}%`;
    if (completedPercentSpan) completedPercentSpan.textContent = `${completedPercent}%`;
    if (pendingPercentSpan) pendingPercentSpan.textContent = `${pendingPercent}%`;
    if (totalTasksSpan) totalTasksSpan.textContent = `Total Tasks: ${total}`;
  });
}

// To-Do List - Variable declarations
let addText, addDate, listSection;

// Single DOMContentLoaded listener to initialize everything
document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  addText = document.getElementById('add-text');
  addDate = document.getElementById('add-date');
  listSection = document.getElementById('list-section');

  // Initialize dashboard functionality
  updateProgressBarsFromTaskData();
  updateCardInfo();
  renderWeekCards();
  showList();

  // Initialize card interactions
  const cards = document.querySelectorAll(".card");
  const tabs = document.querySelectorAll(".task-category");

  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents click from bubbling to card

      const clickedCard = tab.closest(".card");

      // Remove 'active' class and restore z-index
      cards.forEach(card => {
        card.classList.remove("active");
        const originalZ = card.getAttribute("data-z");
        card.style.zIndex = originalZ;
      });

      // Add 'active' and bring this card to front
      clickedCard.classList.add("active");
      clickedCard.style.zIndex = 10;
    });
  });

  // Initialize toggle functionality
  initializeToggle();
});

function addTask() {
  if (!addText || addText.value === '') {
    alert("You must write something!");
    return;
  }
  if (!addDate || addDate.value === '') {
    alert("You must add a date!");
    return;
  } else {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";

    let li = document.createElement("li");
    li.innerHTML = addText.value;

    const uncheckedBtn = document.createElement("button");
    uncheckedBtn.className = "unchecked-btn";
    uncheckedBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;

    const checkedBtn = document.createElement("button");
    checkedBtn.className = "checked-btn";
    checkedBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50px" height="50px" fill="#fe0000"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>`;

    checkedBtn.style.display = "none";

    const trashBtn = document.createElement("button");
    trashBtn.className = "trash-btn";
    trashBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="#fe0000"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"/></svg>`;

    uncheckedBtn.addEventListener('click', () => {
      li.classList.add("completed");
      taskDiv.classList.add("completed");
      uncheckedBtn.style.display = "none";
      checkedBtn.style.display = "block";
      saveData();
    });

    checkedBtn.addEventListener('click', () => {
      li.classList.remove("completed");
      taskDiv.classList.remove("completed");
      checkedBtn.style.display = "none";
      uncheckedBtn.style.display = "block";
      saveData();
    });

    trashBtn.addEventListener('click', () => {
      taskDiv.remove();
      saveData();
    });

    let dateSpan = document.createElement("span");
    dateSpan.className = "date";
    dateSpan.innerHTML = addDate.value;

    const now = new Date();
    const timeDate = now.toLocaleString(['en-PH'], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const timeSpan = document.createElement("span");
    timeSpan.className = "time";
    timeSpan.innerHTML = timeDate;

    taskDiv.appendChild(li);
    taskDiv.appendChild(trashBtn);
    li.appendChild(uncheckedBtn);
    li.appendChild(checkedBtn);
    li.appendChild(dateSpan);
    li.appendChild(timeSpan);
    listSection.appendChild(taskDiv);

    addText.value = '';
    addDate.value = '';
    saveData();
  };
}

function saveData() {
  localStorage.setItem(`todo-${currentCategory}`, listSection.innerHTML);

  const allTasks = document.querySelectorAll('.task-item');

  let structuredTasks = [];

  allTasks.forEach(task => {
    const li = task.querySelector('li');
    const taskText = li?.childNodes[0]?.nodeValue?.trim() || '';
    const date = li?.querySelector('.date')?.textContent || '';
    const time = li?.querySelector('.time')?.textContent || '';
    const isCompleted = li?.classList.contains("completed");

    if (taskText && date) {
      structuredTasks.push({
        text: taskText,
        date,
        time,
        category: currentCategory,
        completed: isCompleted
      });
    }

    let allData = JSON.parse(localStorage.getItem("taskData")) || [];
    allData = allData.filter(task => task.category !== currentCategory);
    allData = allData.concat(structuredTasks);

    localStorage.setItem("taskData", JSON.stringify(allData));
  });
}

let currentCategory = localStorage.getItem('lastCategory') || 'work';

function showCategory(category) {
  currentCategory = category;
  localStorage.setItem('lastCategory', currentCategory);
  showList();
}

document.querySelectorAll('.items').forEach(item => {
  item.addEventListener('click', () => {
    currentCategory = item.querySelector('h2').textContent.trim().toLowerCase();
    localStorage.setItem('lastCategory', currentCategory);
    showList();
  });
});

function showList() {
  const categorySpan = document.querySelector(".category");
  categorySpan.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
  listSection.innerHTML = localStorage.getItem(`todo-${currentCategory}`) || '';
  reattachListeners();
}
showList();
updateCardInfo();

function reattachListeners() {
  const taskItems = document.querySelectorAll('.task-item');

  taskItems.forEach(taskDiv => {
    const li = taskDiv.querySelector('li');
    const uncheckedBtn = taskDiv.querySelector('.unchecked-btn');
    const checkedBtn = taskDiv.querySelector('.checked-btn');
    const trashBtn = taskDiv.querySelector('.trash-btn');

    if (li.classList.contains("completed")) {
      uncheckedBtn.style.display = "none";
      checkedBtn.style.display = "block";
    } else {
      uncheckedBtn.style.display = "block";
      checkedBtn.style.display = "none";
    }

    uncheckedBtn.addEventListener('click', () => {
      li.classList.add("completed");
      uncheckedBtn.style.display = "none";
      checkedBtn.style.display = "block";
      saveData();
    });

    checkedBtn.addEventListener('click', () => {
      li.classList.remove("completed");
      checkedBtn.style.display = "none";
      uncheckedBtn.style.display = "block";
      saveData();
    });

    trashBtn.addEventListener('click', () => {
      taskDiv.remove();
      saveData();
    });
  });
}

listSection.addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    e.target.classList.toggle('completed');
  }
});

showList();

function initializeToggle() {
  const barContainer = document.querySelector(".bar-container");
  if (!barContainer) return;

  const toggleDiv = document.createElement("div");
  toggleDiv.className = "toggle-div";

  const openToggle = document.createElement("button");
  openToggle.className = "open-toggle";
  openToggle.innerHTML = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" id="arrow-circle-down" viewBox="0 0 24 24" width="50" height="50" fill="#ffd700"><path d="M12,24A12,12,0,1,0,0,12,12.013,12.013,0,0,0,12,24ZM6.269,12.4,11.356,7.25a.9.9,0,0,1,1.288,0L17.731,12.4a.924.924,0,0,1-.644,1.575H6.913A.924.924,0,0,1,6.269,12.4Z"/></svg>`;

  const closeToggle = document.createElement("button");
  closeToggle.className = "close-toggle";
  closeToggle.innerHTML = '<?xml version="1.0" encoding="UTF-8"?> <svg xmlns="http://www.w3.org/2000/svg" id="arrow-circle-down" viewBox="0 0 24 24" width="50" height="50" fill="#ffd700"><path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm5.731,11.6L12.644,16.75a.9.9,0,0,1-1.288,0L6.269,11.6a.924.924,0,0,1,.644-1.575H17.087A.924.924,0,0,1,17.731,11.6Z"/></svg>';

  toggleDiv.appendChild(openToggle);
  toggleDiv.appendChild(closeToggle);
  barContainer.appendChild(toggleDiv);

  closeToggle.addEventListener('click', () => {
    barContainer.classList.add("close");
    toggleDiv.classList.remove("toggle-open");
  });

  openToggle.addEventListener('click', () => {
    barContainer.classList.remove("close");
    toggleDiv.classList.add("toggle-open");

    // Only create calendar toggle if it doesn't exist
    if (!barContainer.querySelector('.calendar-toggle-div')) {
      const calendarToggleDiv = document.createElement("div");
      calendarToggleDiv.className = "calendar-toggle-div";

      const calendarOpenToggle = document.createElement("button");
      calendarOpenToggle.className = "calendar-open-toggle";
      calendarOpenToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="#050a2c" class="size-6"> <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd"/></svg>';

      const calendarContainer = document.getElementById('calendar-container');
      const spiderBtn = document.getElementById('spider-btn');

      calendarOpenToggle.addEventListener('click', () => {
        showCalendar();
      });

      if (spiderBtn) {
        spiderBtn.addEventListener('click', () => {
          calendarContainer.style.display = "none";
          document.getElementById('main-container').style.display = "block";
          document.getElementById('main-nav').style.display = "block";
        });
      }

      calendarToggleDiv.appendChild(calendarOpenToggle);
      barContainer.appendChild(calendarToggleDiv);
    }
  });
}

// Calendar 
const calendarDaysContainer = document.getElementById('days-grid');

function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const allTasks = JSON.parse(localStorage.getItem("taskData")) || [];

  // find all dates that have tasks
  const datesWithTasks = allTasks.map(task => task.date);

  calendarDaysContainer.innerHTML = '';

  // for each day in the current month:
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;

    if (datesWithTasks.includes(currentDate)) {
      dayDiv.classList.add("highlight"); // you define this in CSS
    }

    calendarDaysContainer.appendChild(dayDiv);
  }

  document.getElementById("year").textContent = year;
  document.getElementById("month").textContent = today.toLocaleString('default', { month: 'long' });
}

renderCalendar();

function showCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  const mainContainer = document.getElementById('main-container');
  const mainNav = document.getElementById('main-nav');

  if (calendarContainer && mainContainer && mainNav) {
    calendarContainer.style.display = 'block';
    mainContainer.style.display = 'none';
    mainNav.style.display = 'none';
    renderCalendar();
  }
}

function hideCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  const mainContainer = document.getElementById('main-container');
  const mainNav = document.getElementById('main-nav');

  if (calendarContainer && mainContainer && mainNav) {
    calendarContainer.style.display = 'none';
    mainContainer.style.display = 'block';
    mainNav.style.display = 'block';
  }
}

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker registered!'))
      .catch(err => console.error('SW registration failed:', err));
  }
});
