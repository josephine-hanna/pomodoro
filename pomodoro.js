const timer = {
    pomodoro: 1,
    shortBreak: 5, 
    longBreak: 10,
    longBreakInterval: 4, 
    sessions: 0,
}


let interval; 

const modeButtons = document.querySelector("#mode-buttons");
modeButtons.addEventListener("click", handleMode);

function handleMode(event) {
    const {mode} = event.target.dataset;

    if(!mode) return;
    switchMode(mode);
    stopTimer();
}

function switchMode(mode) {
    timer.mode = mode; 
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    document
        .querySelectorAll("button[data-mode]")
        .forEach(e => e.classList.remove("active"));
    document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
    document.body.style.backgroundImage = `var(--${mode})`;
    document
        .getElementById("js-progress")
        .setAttribute("max", timer.remainingTime.total);

    updateClock();
}

function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2,0);
    const seconds = `${remainingTime.seconds}`.padStart(2,0);

    const min = document.getElementById("minutes");
    const sec = document.getElementById("seconds");
    min.textContent = minutes; 
    sec.textContent = seconds;

    const progress = document.getElementById("js-progress");
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}


function startTimer() {
    let {total} = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total*1000;
    
    if(timer.mode === "pomodoro") timer.sessions++;


    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'Stop';
    mainButton.classList.add('active');
  

    interval = setInterval(function() {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;
        if(total <= 0){
            clearInterval(interval);
            switch (timer.mode) {
                case 'pomodoro':
                  if (timer.sessions % timer.longBreakInterval === 0) {
                    switchMode('longBreak');
                  } else {
                    switchMode('shortBreak');
                  }
                  break;
                default:
                  switchMode('pomodoro');
              }
        
              startTimer();
        }
    }, 1000);
}

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference/1000, 10);
    const minutes = Number.parseInt((total/60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return{
        total, 
        minutes,
        seconds,
    };
}

const mainButton = document.getElementById("start");
mainButton.addEventListener("click", () => {
    const {action} = mainButton.dataset;
    if(action === "start"){
        startTimer();
    }else{
        stopTimer();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});


function stopTimer() {
    clearInterval(interval);

    mainButton.dataset.action = "start";
    mainButton.textContent = "Start";
    mainButton.classList.remove("active");
}

/* TODO LISTE */

let todtoItems = [];

function renderTodo(todo) {
    const list = document.querySelector(".js-todo-list");

    const isChecked = todo.checked ? "done": "";
    const node = document.createElement("li");

    node.setAttribute("class", "todo-item ${isChecked}");
    node.setAttribute("data-key", todo.id);

    node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
        hallo
    </button>`;


    if(item){
        list.replaceChild(node, item);
    }else{
        list.append(node);
    }
}

function addTodo(text) {
    const todo = {
        text,
        checked: false,
        id: Date.now(),
    };

    todtoItems.push(todo);
    renderTodo(todo);
}

function toggleDone(key) {
    const index = todtoItems.findIndex(item => item.id === Number(key));
    todtoItems[index].checked = !todtoItems[index].checked;
    renderTodo(todtoItems[index]);
}

function deleteTodo(key) {
    const index = todtoItems.findIndex(item => item.id === Number(key));
    const todo = {
        deleted: true,
        ...todtoItems[index]
    };
    todtoItems = todtoItems.filter(item => item.id !== Number(key));
    renderTodo(todo);
}

const form  = document.querySelector(".js-form");
form.addEventListener("submit", event => {
    event.preventDefault();
    const input = document.querySelector(".js-todo-input");
    const text = input.value.trim();

    if(text !== ""){
        addTodo(text);
        input.value="";
        input.focus();
    }
});

const list = document.querySelector(".js-todo-list");
list.addEventListener("click", event => {
    if (event.target.classList.contains('js-tick')) {
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
      }
      
      if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
      }
});

document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoItems');
    if (ref) {
      todoItems = JSON.parse(ref);
      todoItems.forEach(t => {
        renderTodo(t);
      });
    }
  });