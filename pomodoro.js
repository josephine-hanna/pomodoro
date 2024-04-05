const timer = {
  pomodoro: 1,
  shortBreak: 1, 
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
    .getElementById("progress")
    .style.setProperty("--progress", timer.remainingTime.total)
  updateClock();
  updateHearts();
  if (mode != "pomodoro") {
    document.documentElement.classList.add("break");
  } else{
    document.documentElement.classList.remove("break");
  }
}

function updateClock() {
  const { remainingTime,mode } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2,0);
  const seconds = `${remainingTime.seconds}`.padStart(2,0);

  const min = document.getElementById("minutes");
  const sec = document.getElementById("seconds");
  min.textContent = minutes; 
  sec.textContent = seconds;

  document.title = `Pomodoro - ${minutes}:${seconds}`;

  const totalSeconds = timer[mode] * 60;
  const remainingSeconds = remainingTime.minutes * 60 + remainingTime.seconds;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // Update progress bar width
  const progressBar = document.getElementById("progress");
  progressBar.style.setProperty('--progress', `${progress}%`);
  const gradientAngle = progress * 3.6; // Convert progress to degrees
  progressBar.style.backgroundImage = `conic-gradient(rgb(255, 255, 255, 30%)${gradientAngle}deg, transparent 0deg)`;
  
}

function updateHearts() {
  const hearts = document.querySelectorAll(".hearts i");
  const sessions = timer.sessions;

  hearts.forEach((heart, index) =>{
    if(index < sessions){
      heart.classList.remove("bi-bookmark-heart");
      heart.classList.add("bi-bookmark-heart-fill");
    }else{
      heart.classList.remove("bi-bookmark-heart-fill");
      heart.classList.add("bi-bookmark-heart");
    }
  })
  if(sessions >= 4){
    timer.sessions = 0;
  }
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
  updateHearts();
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
  if(timer.sessions != 0) timer.sessions--;
}

/* TODO LISTE */

var myNodelist = document.getElementsByTagName("LI");
for (var i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var p = document.createElement("P"); // Create a new paragraph element
  var inputValue = document.createTextNode(myNodelist[i].textContent); // Get the text content of the list item
  p.appendChild(inputValue); // Append the input value to the paragraph
  span.className = "close";
  span.appendChild(p); // Append the paragraph to the span
  myNodelist[i].innerHTML = ''; // Remove existing content inside the list item
  myNodelist[i].appendChild(span); // Append the span to the list item

  // Click on a close button to hide the current list item
  span.onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  };

  // Click on the paragraph to toggle checked class
  p.onclick = function() {
    var li = this.parentElement.parentElement; // Get the parent li of the clicked paragraph
    li.classList.toggle('checked'); // Toggle the checked class of the parent li
  };
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    if (ev.target.classList.contains('checked')) {
      list.appendChild(ev.target);
    }
  }
}, false);

function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var p = document.createElement("P"); // Create a new paragraph element
  var inputValuePara = document.createTextNode(inputValue); // Create a text node with input value
  p.appendChild(inputValuePara); // Append the input value to the paragraph
  li.appendChild(p); // Append the paragraph to the list item
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var closeSymbol = document.createTextNode("\u00D7"); // Text content for the close symbol
  span.className = "close";
  span.appendChild(closeSymbol); // Append the close symbol to the span
  li.appendChild(span); // Append the span to the list item

  // Click on a close button to hide the current list item (for newly created items)
  span.onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  };

  // Click on the paragraph to toggle checked class (for newly created items)
  p.onclick = function() {
    var li = this.parentElement; // Get the parent li of the clicked paragraph
    li.classList.toggle('checked'); // Toggle the checked class of the parent li
  };
  saveList();
}
const input = document.getElementById("myInput");
input.addEventListener("keyup", function(event){
  if(event.key === "Enter"){
    event.preventDefault();
    newElement();
  }
})



function toggleHiddenTodo(){
  var hiddenDiv = document.getElementById("todo");
  var button = document.getElementById("display");
  hiddenDiv.classList.toggle("active");
  button.classList.toggle("active");
}
/*

document.addEventListener('DOMContentLoaded', function() {
    var savedList = localStorage.getItem('savedList');
    if (savedList) {
      document.getElementById('myUL').innerHTML = savedList;
      attachEventListeners(); // Reattach close listeners to the newly loaded list items
    }
});

function attachEventListeners() {
    var listItems = document.querySelectorAll('li');
    listItems.forEach(function(item) {
      item.addEventListener('click', function() {
        item.classList.toggle('checked');
        saveList(); // Save the updated list after a list item is checked
      });
  
      var closeBtn = item.querySelector('.close');
      closeBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling to the list item
        var listItem = this.parentElement;
        listItem.style.display = 'none';
        saveList(); // Save the updated list after an item is removed
      });
    });
  }

function saveList() {
    var listHtml = document.getElementById('myUL').innerHTML;
    localStorage.setItem('savedList', listHtml);
}
*/
