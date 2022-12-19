// Класс для отдельной привычки
// name - наименование,
// planned - массив запланированных дней,
// done - те дни, когда привычка выполнялась,
// undone - те дни, когда привычка была запланирована, но не выполнена.
class Habit {
    constructor(name, planned, done, undone) {
        this.name = name;
        this.planned = planned;
        this.done = done;
        this.undone = undone;
    }

    // Устанавливаем метку planned для указанного дня.
    // Так как в массиве индексы от 0, вычитаем из указанного дня 1.
    setDayPlanned(day) {
        this.planned.push(day - 1);
    }

    // Устанавливаем метку done для указанного дня
    setDayDone(day) {
        // Получаем индекс указанного дня в массиве запланированных
        let dayIndex = this.planned.indexOf(parseInt(day) - 1);
        // Удаляем текущий день из массива запланированных
        this.planned.splice(dayIndex, 1);
        // Добавляем текущий день в массив выполненных
        this.done.push(day - 1);
    }

    // Устанавливаем метку undone для указанного дня
    setDayUndone(day) {
        // Получаем индекс указанного дня в массиве выполненных
        let dayIndex = this.done.indexOf(parseInt(day) - 1);
        // Удаляем текущий день из массива выполненных
        this.done.splice(dayIndex, 1);
        // Добавляем текущий день в массив невыполненных
        this.undone.push(day - 1);
    }

    // Снимаем все метки для указанного дня
    setDayNormal(day) {
        // Получаем индекс указанного дня в массиве невыполненных
        let dayIndex = this.undone.indexOf(parseInt(day) - 1);
        // Удаляем текущий день из массива невыполненных
        this.undone.splice(dayIndex, 1);
    }

    // Получаем OuterHTML содержащий все данные для указанной привычки
    getOuterHTML() {
        let html = `<div class="columns is-multiline is-mobile">
    <div class="column has-text-right tracker has-text-weight-bold habit-name">
        ${this.name} 
    </div>\n`;
        for (let i = 0; i < monthDays; i++) {
            let classes = "column is-narrow tracker";
            // День месяца с двумя знаками. Например, 01.
            let dayTwoDigit = (i + 1).toString().padStart(2, "0");
            // Проверяем наличие указанного дня в запланированных, выполненных или пропущенных
            //  и добавляем необходимый класс
            if (this.planned.includes(i)) {
                classes = classes + " planned";
            } else if (this.done.includes(i)) {
                classes = classes + " done";
            } else if (this.undone.includes(i)) {
                classes = classes + " undone";
            }
            html = html + `<div class="${classes}">${dayTwoDigit}</div>`;
        }
        // Закрываем основной div для привычки
        html = html + "</div>\n";

        return html;
    }


    // Выводит привычку на страницу
    print() {
        // Получаем главный div, внутри которого будем размещать привычки
        let monthDiv = document.getElementById("month");
        // Создаем новый элемент, который добавим в главный div
        let newElement = document.createElement("div");
        // Добавляем этот элемент в главный div месяца
        monthDiv.appendChild(newElement);
        // Вставляем сгенерированную размету для привычки в этот добавленный элемент
        newElement.outerHTML = this.getOuterHTML();
    }
}

class Month {
    constructor(name, days, habits) {
        this.name = name;
        // Количество дней в месяце
        this.days = days;
        this.habits = habits;
    }

    // Добавляем привычку для отслеживания в этом месяце
    addHabit(habit) {
        // Проверяем нет ли ее уже в списке месяца
        if (this.habitInMonth(habit)) {
            // TODO: выводить сообщение пользователю о том, что такая привычка уже есть в списке
            return false;
        } else {
            this.habits.push(habit);
            return true;
        }
    }

    // Проверяем нет ли данной привычки уже в списке месяца
    habitInMonth(habit) {
        if (this.habits.length > 0) {
            for (let i = 0; i < this.habits.length; i++) {
                if (this.habits[i].name === habit.name) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }

    // Выводим все данные по месяцу
    print() {
        // Перебор привычек в месяце и формирование OuterHTML для каждой из них
        for (let i = 0; i < this.habits.length; i++) {
            this.habits[i].print();
        }
    }

    // Сохраняем состояние месяца в локальное хранилище
    saveToLocalStorage() {
        localStorage.december = JSON.stringify(this);
    }

}

// FIXME: Переписать для произвольного месяца
let december = new Month("December", 31, []);
// Пробуем загрузить данные из локального хранилища
let decemberJSONString = localStorage.december;
// Количество дней в текущем месяце
const monthDays = december.days;
// Если из локального хранилища получены данные
if (typeof decemberJSONString === "string") {
    // Преобразуем строку JSON в объект
    decemberJSON = JSON.parse(decemberJSONString);
    // Для каждой привычки из хранилища генерируем новую привычку типа Habit
    // и добавляем ее в наш месяц.
    // Если просто передать все эти привычки нашему месяцу, их тип не будет Habit,
    // а следовательно они не будут поддерживать методов нашего класса Habit.
    decemberJSON.habits.forEach(habit => {
        let habitToRestore = new Habit(habit.name, habit.planned, habit.done, habit.undone);
        december.addHabit(habitToRestore);
    });
    // Выводим в браузер все отслеживаемые привычки текущего месяца
    december.print();
}

// Получает имя привычки из свойств объекта, по которому кликнули мышью
function getHabitName(e) {
    return e.target.parentElement.firstElementChild.innerText;
}

// Получаем объект привычки по ее имени
function getHabitByName(month, habitName) {
    // Возвращает массив из одного элемента. Мы берем первый,
    //  чтобы получить сам объект
    return month.habits.filter(obj => obj.name === habitName)[0];
}

// Добавляет привычку в список месяца.
// Выводит привычку на странице.
// Сохраняет состояние месяца.
// Вешает listener на новую привычку.
function addNewHabitHandler(e) {
    // FIXME: переписать для месяца в параметре, а не жестко декабря
    // Если нажата клавиша Ввод
    if (e.keyCode === 13) {
        let name = document.getElementById("addHabit");
        let newHabit = new Habit(name.value, [], [], []);
        // Добавляем привычку в список текущего месяца и
        // если успешно добавлена, выводим привычку на страницу
        if (december.addHabit(newHabit)) {
            newHabit.print();
        }
        // Очищаем значение, чтобы в поле input ничего не сохранялось
        name.value = "";
        // Сохраняем состояние месяца в локальное хранилище
        // FIXME: переписать для метода класса Month
        december.saveToLocalStorage();
        // Вешаем обработчик на все дни трекера, так как добавленная новая
        //  привычка обработчика не имеет.
        addListener();
    }
}


// Устанавливаем класс для элемента в зависимости от статуса привычки
//  Цикл установки идет по кругу: planned -> done -> undone -> normal
// FIXME: переписать для класса
function setHabitState(e) {
    // Получаем имя привычки из элемента DOM
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
        // Добавляем текущий день в массив выполненных
        habit.setDayDone(targetDay);
    } else if (classes.includes("done")) {
        e.target.classList.remove("done");
        e.target.classList.add("undone");
        // Добавляем текущий день в массив невыполненных
        habit.setDayUndone(targetDay);
    } else if (classes.includes("undone")) {
        e.target.classList.remove("undone");
        // Удаляем текущий день из массива пропущенных
        habit.setDayNormal(targetDay);
    } else {
        e.target.classList.add("planned");
        // Добавляем текущий день в массив запланированных
        habit.setDayPlanned(targetDay);
    }
    // Сохраняем состояние месяца в локальное хранилище
    december.saveToLocalStorage();
}

// Вешаем обработчик события на каждый div дня месяца.
function addListener() {
    //  Ориентир - класс "tracker".
    let elements = document.getElementsByClassName("tracker");
    for (let i = 0; i < elements.length; i++) {
        elements[i].onclick = setHabitState;
    }
}


window.onload = function () {
    // Вешаем обработчик на все дни в трекере
    addListener();

    // Вешаем обработчик нажатия клавиш в поле input
    document.getElementById("addHabit").onkeydown = addNewHabitHandler;
}
