// Трекер отслеживает привычки в течение месяца по параметрам:
//  запланировано, выполнено, не выполнено.
//  Для каждого параметра указаны дни, для которых он применяется.
//  Отсчет дней от нуля.
const december = [
    {
        name: "Ранний подъём",
        planned: [0, 3, 11, 30],
        done: [5, 10],
        undone: [15, 7]
    },
    {
        name: "JavaScript",
        planned: [3, 10, 30],
        done: [5, 15],
        undone: [18, 27]
    },
    {
        name: "Golang",
        planned: [0, 5, 10, 21],
        done: [3, 15, 8],
        undone: [11, 23, 30]
    }
]
// Количество дней в текущем месяце
const monthDays = 31;

// Устанавливаем класс для элемента в зависимости от статуса привычки
//  Цикл установки идет по кругу: planned -> done -> undone -> normal
function setHabitState(e) {
    let classes = e.target.getAttribute("class").split(" ");
    if (classes.includes("planned")) {
        e.target.classList.remove("planned");
        e.target.classList.add("done");
    } else if (classes.includes("done")) {
        e.target.classList.remove("done");
        e.target.classList.add("undone");
    } else if (classes.includes("undone")) {
        e.target.classList.remove("undone");
    } else {
        e.target.classList.add("planned");
    }
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
        // Получаем главный div, внутри которого будем размещать привычки
        let monthDiv = document.getElementById("month");
        // Создаем новый элемент, который добавим в главный div
        let newElement = document.createElement("div");
        // Добавляем этот элемент в главный div месяца
        monthDiv.appendChild(newElement);
        // Вставляем сгенерированную размету для привычки в этот добавленный элемент
        newElement.outerHTML = createHabitMonthOuterHTML(month[i]);
    }
}


function init() {
    // Выводим все отслеживаемые привычки текущего месяца
    printMonth(december);

    // Вешаем обработчик события на каждый div дня месяца.
    //  Ориентир - класс "tracker".
    let elements = document.getElementsByClassName("tracker");
    for (let i = 0; i < elements.length; i++) {
        elements[i].onclick = setHabitState;
    }
}

window.onload = init;