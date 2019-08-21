var day = document.getElementById("day");
var week = document.getElementById("week");
var all_time = document.getElementById("all_time");

day.onclick = function () {
    day.style.backgroundColor = "#ffe683"
    week.style.backgroundColor = "#f6c70d"
    all_time.style.backgroundColor = "#f6c70d"
    day.style.fontWeight = "bold"
    week.style.fontWeight = "normal"
    all_time.style.fontWeight = "normal"
}

week.onclick = function () {
    week.style.backgroundColor = "#ffe683"
    day.style.backgroundColor = "#f6c70d"
    all_time.style.backgroundColor = "#f6c70d"
    week.style.fontWeight = "bold"
    day.style.fontWeight = "normal"
    all_time.style.fontWeight = "normal"
}

all_time.onclick = function () {
        all_time.style.backgroundColor = "#ffe683"
        week.style.backgroundColor = "#f6c70d"
        day.style.backgroundColor = "#f6c70d"
        all_time.style.fontWeight = "bold"
        week.style.fontWeight = "normal"
        day.style.fontWeight = "normal"
    }