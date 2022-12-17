// Трекер отслеживает привычки в течение месяца по параметрам:
//  запланировано, выполнено, не выполнено.
//  Для каждого параметра указаны дни, для которых он применяется.
//  Отсчет дней от нуля.
//  Например:
//  let Habit = {
//      name: name.value,
//      planned: [0, 5, 19],
//      done: [3, 28],
//      undone: [7, 12, 31]
//  }


// Глобальная переменная.
// Хранит все данные по всем привычкам в этом месяце.
let december;

// Количество дней в текущем месяце
const monthDays = 31;

// Устанавливаем класс для элемента в зависимости от статуса привычки
//  Цикл установки идет по кругу: planned -> done -> undone -> normal
function setHabitState(e) {
    // Получаем имя привычки
    let habitName = getHabitName(e);
    // Получаем объект привычки по имени
    let habit = getHabitByName(december, habitName);
    // Получаем день, по которому кликнули мышью
    let targetDay = e.target.innerText;
    // Преобразуем строку классов в массив, для точного поиска вхождения класса
    let classes = e.target.getAttribute("class").split(" ");
    if (classes.includes("planned")) {
        e.target.classList.remove("planned");
        e.target.classList.add("done");
        // Получаем индекс указанного дня в массиве
        let dayIndex = getDayIndex(habit, "planned", targetDay);
        // Удаляем текущий день из массива запланированных
        habit.planned.splice(dayIndex, 1);
        // Добавляем текущий день в массив выполненных
        habit.done.push(targetDay - 1);
    } else if (classes.includes("done")) {
        e.target.classList.remove("done");
        e.target.classList.add("undone");
        // Получаем индекс указанного дня в массиве
        let dayIndex = getDayIndex(habit, "done", targetDay);
        // Удаляем текущий день из массива запланированных
        habit.done.splice(dayIndex, 1);
        // Добавляем текущий день в массив выполненных
        habit.undone.push(targetDay - 1);
    } else if (classes.includes("undone")) {
        e.target.classList.remove("undone");
        // Получаем индекс указанного дня в массиве
        let dayIndex = getDayIndex(habit, "undone", targetDay);
        // Удаляем текущий день из массива пропущенных
        habit.undone.splice(dayIndex, 1);
    } else {
        e.target.classList.add("planned");
        habit.planned.push(targetDay - 1);
    }
    // Сохраняем состояние месяца в локальное хранилище
    saveMonthData();
}

// Получаем индекс элемента массива по его содержимому.
// В нашем массиве счет идет от нуля, и дни хранятся на
// единицу меньше, чем в жизни.
function getDayIndex(habit, status, day) {
    switch (status) {
        case "planned":
            return habit.planned.indexOf(parseInt(day) - 1);
        case "done":
            return habit.done.indexOf(parseInt(day) - 1);
        case "undone":
            return habit.undone.indexOf(parseInt(day) - 1);
    }
}

// Получает имя привычки из свойств объекта, по которому кликнули мышью
function getHabitName(e) {
    return e.target.parentElement.firstElementChild.innerText;
}


// Получаем объект привычки по ее имени
function getHabitByName(month, habitName) {
    // Возвращает массив из одного элемента. Мы берем первый,
    //  чтобы получить сам объект
    return month.filter(obj => obj.name === habitName)[0];
}

// Формируем OuterHTML содержащий все данные для указанной привычки
function createHabitMonthOuterHTML(habit) {
    let html = `<div class="columns is-multiline is-mobile">
    <div class="column has-text-right tracker has-text-weight-bold">
        ${habit.name} 
    </div>\n`;
    for (let i = 0; i < monthDays; i++) {
        let classes = "column is-narrow tracker";
        // День месяца с двумя знаками. Например, 01.
        let dayTwoDigit = (i + 1).toString().padStart(2, "0");
        // Проверяем наличие указанного дня в запланированных, выполненных или пропущенных
        //  и добавляем необходимый класс
        if (habit.planned.includes(i)) {
            classes = classes + " planned";
        } else if (habit.done.includes(i)) {
            classes = classes + " done";
        } else if (habit.undone.includes(i)) {
            classes = classes + " undone";
        }
        html = html + `<div class="${classes}">${dayTwoDigit}</div>`;
    }
    // Закрываем основной div для привычки
    html = html + "</div>\n";

    return html;
}

// Выводим на странице разметку для каждой привычки в текущем месяце
function printMonth(month) {
    // Перебор привычек в месяце и формирование OuterHTML для каждой из них
    for (let i = 0; i < month.length; i++) {
        printHabit(month[i]);
    }
}

// Выводит привычку на страницу
function printHabit(habit) {
    // Получаем главный div, внутри которого будем размещать привычки
    let monthDiv = document.getElementById("month");
    // Создаем новый элемент, который добавим в главный div
    let newElement = document.createElement("div");
    // Добавляем этот элемент в главный div месяца
    monthDiv.appendChild(newElement);
    // Вставляем сгенерированную размету для привычки в этот добавленный элемент
    newElement.outerHTML = createHabitMonthOuterHTML(habit);
}

// Проверяет есть ли уже данная привычка в списке месяца
function habitInMonth(month, habit) {
    for (let i = 0; i < month.length; i++) {
        if (month[i].name === habit.name) {
            return true;
        }
    }
    return false;
}

// Добавляет привычку в список месяца.
// Выводит привычку на странице.
function addNewHabit(e) {
    if (e.keyCode === 13) {
        let name = document.getElementById("addHabit");
        let newHabit = {
            name: name.value,
            planned: [],
            done: [],
            undone: []
        }
        if (!habitInMonth(december, newHabit)) {
            // Добавляем привычку в список текущего месяца
            december.push(newHabit);
            // Выводим привычку на страницу
            printHabit(newHabit);
        }
        // Очищаем значение, чтобы в поле input ничего не сохранялось
        name.value = "";
        // Сохраняем состояние месяца в локальное хранилище
        saveMonthData();
        // Вешаем обработчик на все дни трекера, так как добавленная новая
        //  привычка обработчика не имеет.
        addListener();
    }
}

// Сохраняем состояние месяца в локальное хранилище
function saveMonthData() {
    localStorage.december = JSON.stringify(december);
}


// Вешаем обработчик события на каждый div дня месяца.
function addListener() {
    //  Ориентир - класс "tracker".
    let elements = document.getElementsByClassName("tracker");
    for (let i = 0; i < elements.length; i++) {
        elements[i].onclick = setHabitState;
    }
}

function init() {
    // Пробуем загрузить данные из локального хранилища
    december = localStorage.december;
    if (typeof december !== "string") {
        // Создаем массив, так как в локальном хранилище ничего нет
        december = [];
    } else {
        // Преобразуем строку JSON в объект
        december = JSON.parse(december);
        // Выводим все отслеживаемые привычки текущего месяца
        printMonth(december);
    }

    // Вешаем обработчик на все дни в трекере
    addListener();

    // Вешаем обработчик нажатия клавиш в поле input
    document.getElementById("addHabit").onkeydown = addNewHabit;
}

window.onload = init;