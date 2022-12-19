class Habit {
    constructor(name, planned, done, undone) {
        this.name = name;
        this.planned = planned;
        this.done = done;
        this.undone = undone;
    }

    // Устанавливаем метку planned для указанного дня
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
            console.warn("Habit already in month");
        } else {
            this.habits.push(habit);
        }
    }

    // Проверяем нет ли данной привычки уже в списке месяца
    habitInMonth(habit) {
        console.log(this.habits);
        console.log(habit);
        if (this.habits.length > 0) {
            for (let i = 0; i < this.habits.length; i++) {
                if (this.habits[i].name == habit.name) {
                    console.log(this.habits[i].name, " | ", habit.name);
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
}

let habit1 = new Habit("Бег", [], [], []);
let habit2 = new Habit("Прогулка", [], [], []);
let habit3 = new Habit("Прогулка", [], [], []);
// habit1.setDayPlanned(15);
// habit1.setDayPlanned(20);
// habit1.setDayDone(20);
// habit2.setDayPlanned(31);
//
let december = new Month("December", 31, []);
december.addHabit(habit1);
december.addHabit(habit2);
december.addHabit(habit3);
december.addHabit(habit3);
console.log(december);