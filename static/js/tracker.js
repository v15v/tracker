/**
 *
 * Трекер позволяет отслеживать в течение месяца выполняете ли вы
 * запланированные рутинные операции и практикуете ли вы привычки,
 * которые решили привить.
 *
 * Статус отмечается следующим образом:
 *  planned - привычка запланирована на указанный день.
 *  done - запланированная привычка выполнена.
 *  undone - запланированная привычка в этот день не была выполнена.
 *  Если ничего не запланировано на день, он никак не отмечается в таблице.
 *
 */

// planned - массив запланированных дней,
// done - те дни, когда привычка выполнялась,
// undone - те дни, когда привычка была запланирована, но не выполнена.
class Habit {
    constructor(habit) {
        if (!habit.name) {
            console.error("Не указано наименование привычки!")
            return
        } else {
            this.name = habit.name
        }
        if (!habit.planned) {
            this.planned = []
        } else {
            this.planned = habit.planned
        }
        if (!habit.done) {
            this.done = []
        } else {
            this.done = habit.done
        }
        if (!habit.undone) {
            this.undone = []
        } else {
            this.undone = habit.undone
        }
    }

    // Устанавливаем метку planned для указанного дня.
    // Так как в массиве индексы от 0, вычитаем из указанного дня 1.
    setDayPlanned(day) {
        this.planned.push(day - 1)
    }

    // Переводим метку из planned в done для указанного дня
    setDayDone(day) {
        // Получаем индекс указанного дня в массиве запланированных
        let dayIndex = this.planned.indexOf(parseInt(day) - 1)
        // Удаляем текущий день из массива запланированных
        this.planned.splice(dayIndex, 1)
        // Добавляем текущий день в массив выполненных
        this.done.push(day - 1)
    }

    // Переводим метку из done в undone для указанного дня
    setDayUndone(day) {
        // Получаем индекс указанного дня в массиве выполненных
        let dayIndex = this.done.indexOf(parseInt(day) - 1)
        // Удаляем текущий день из массива выполненных
        this.done.splice(dayIndex, 1)
        // Добавляем текущий день в массив невыполненных
        this.undone.push(day - 1)
    }

    // Снимаем все метки для указанного дня
    setDayNormal(day) {
        // Получаем индекс указанного дня в массиве невыполненных
        let dayIndex = this.undone.indexOf(parseInt(day) - 1)
        // Удаляем текущий день из массива невыполненных
        this.undone.splice(dayIndex, 1)
    }

    // Генерируем OuterHTML содержащий все данные для указанной привычки
    // Для того, чтобы событие по элементу не обрабатывалось, назначаю
    // такому элементу класс "no-listener"
    getOuterHTML() {
        let html = `<div class="columns is-multiline is-mobile no-listener">
    <div class="column has-text-right tracker has-text-weight-bold habit-name no-listener">
        ${this.name} 
    </div>\n`
        for (let i = 0; i < monthDays; i++) {
            let classes = "column is-narrow tracker"
            // День месяца с двумя знаками. Например, 01.
            let dayTwoDigit = (i + 1).toString().padStart(2, "0")
            // Проверяем наличие указанного дня в запланированных, выполненных или пропущенных
            //  и добавляем необходимый класс
            if (this.planned.includes(i)) {
                classes = classes + " planned"
            } else if (this.done.includes(i)) {
                classes = classes + " done"
            } else if (this.undone.includes(i)) {
                classes = classes + " undone"
            }
            html = html + `<div class="${classes}">${dayTwoDigit}</div>`
        }
        // Добавляем кнопку "Редактировать"
        html = html + `
        <div class="column is-narrow habit-icons no-listener">
            <div class="icon-text no-listener">
              <span class="icon has-text-info no-listener">
                <i class="fas fa-edit habit-edit no-listener"></i>
              </span>
            </div>
        </div>`
        // Добавляем кнопку "Удалить"
        html = html + `
        <div class="column is-narrow habit-icons no-listener">
            <div class="icon-text no-listener">
              <span class="icon has-text-info no-listener">
                <i class="fas fa-trash habit-delete no-listener"></i>
              </span>
            </div>
        </div>`
        // Закрываем основной div для привычки
        html = html + "</div>\n"

        return html
    }


    // Выводит привычку на страницу
    print() {
        // Получаем главный div, внутри которого будем размещать привычки
        let monthDiv = document.querySelector("#month")
        // Создаем новый элемент, который добавим в главный div
        let newElement = document.createElement("div")
        // Добавляем этот элемент в главный div месяца
        monthDiv.appendChild(newElement)
        // Вставляем сгенерированную размету для привычки в этот добавленный элемент
        newElement.outerHTML = this.getOuterHTML()
    }
}

class Month {
    constructor(month) {
        this.name = month.name
        // Количество дней в месяце
        this.days = month.days
        this.habits = month.habits
    }

    // Добавляем привычку для отслеживания в этом месяце
    addHabit(habit) {
        // Проверяем нет ли ее уже в списке месяца
        if (this.habitInMonth(habit)) {
            // TODO: выводить сообщение пользователю о том, что такая привычка уже есть в списке
            return false
        } else {
            this.habits.push(habit)
            return true
        }
    }

    // Удаляем привычку из отслеживания в этом месяце
    deleteHabit(habitName) {
        // Получаем индекс привычки в массиве привычек
        const index = this.habits.findIndex(h => h.name === habitName)
        // Если индекс найден, удаляем привычку и сохраняем месяц
        if (index > -1) {
            this.habits.splice(index, 1)
            this.saveToLocalStorage()
        } else {
            console.warn("Такой привычки нет в списке")
        }
    }

    // Проверяет нет ли данной привычки уже в списке месяца
    habitInMonth(habit) {
        if (this.habits.length > 0) {
            for (let i = 0; i < this.habits.length; i++) {
                if (this.habits[i].name === habit.name) {
                    return true
                }
            }
            return false
        } else {
            return false
        }
    }

    // Выводим все данные по месяцу
    print() {
        // Перебор привычек в месяце и вывод их в браузер методом print для привычки
        for (let i = 0; i < this.habits.length; i++) {
            this.habits[i].print()
        }
    }

    // Сохраняем состояние месяца в локальное хранилище
    saveToLocalStorage() {
        // FIXME: Переписать для произвольного месяца
        localStorage.december = JSON.stringify(this)
    }

}

// FIXME: Переписать для произвольного месяца
let december = new Month({name: "December", days: 31, habits: []})
// Пробуем загрузить данные из локального хранилища
let decemberJSONString = localStorage.december
// Количество дней в текущем месяце
const monthDays = december.days
// Если из локального хранилища получены данные
if (typeof decemberJSONString === "string") {
    // Преобразуем строку JSON в объект
    decemberJSON = JSON.parse(decemberJSONString)
    // Для каждой привычки из хранилища генерируем новую привычку типа Habit
    // и добавляем ее в наш месяц.
    // Если просто передать все эти привычки нашему месяцу, их тип не будет Habit,
    // а следовательно они не будут поддерживать методов нашего класса Habit.
    // TODO: Спросить верно ли я понял этот момент?
    decemberJSON.habits.forEach(habit => {
        let habitToRestore = new Habit({
            name: habit.name,
            planned: habit.planned,
            done: habit.done,
            undone: habit.undone
        })
        december.addHabit(habitToRestore)
    })
    // Выводим в браузер все отслеживаемые привычки текущего месяца
    december.print()
}

// Получает имя привычки из свойств объекта DOM, по которому кликнули мышью
function getHabitName(e) {
    return e.target.parentNode.firstElementChild.innerText
}

// Получаем объект привычки по ее имени
function getHabitByName(month, habitName) { // Возвращает массив из одного элемента. Мы берем первый,
    //  чтобы получить сам объект
    return month.habits.filter(obj => obj.name === habitName)[0]
}

// Добавляет привычку в список месяца.
// Выводит привычку на странице.
// Сохраняет состояние месяца.
// Вешает listener на новую привычку.
function addNewHabitHandler(e) {
    // FIXME: переписать для месяца в параметре, а не жестко декабря
    // Если нажата клавиша Ввод
    if (e.key === "Enter") {
        let name = document.querySelector("#addHabit")
        let newHabit = new Habit({
            name: name.value,
            planned: [],
            done: [],
            undone: []
        })
        // Добавляем привычку в список текущего месяца и
        // если успешно добавлена, выводим привычку на страницу
        if (december.addHabit(newHabit)) {
            newHabit.print()
        }
        // Очищаем значение, чтобы в поле input ничего не сохранялось
        name.value = ""
        // Сохраняем состояние месяца в локальное хранилище
        // FIXME: переписать для произвольного месяца
        december.saveToLocalStorage()
    }
}


// Устанавливаем класс для элемента в зависимости от статуса привычки
//  Цикл установки идет по кругу: planned -> done -> undone -> normal
// FIXME: переписать для класса
function setHabitState(e) {
    // Так как слушатель вешается на родительский элемент,
    // мы проверяем, что событие вызвано не этим самым родительским элементом,
    // а его потомком.
    if (e.target != e.currentTarget) {
        // Так же нужно проигнорировать событие,
        // если его оно сработало на элементах c перечисленными классами.
        // Так как они являются потомками нашего #month, но не являются днями месяца.
        if (e.target.classList.contains("no-listener")) {
            // Выход без каких-либо действий
            return
        } else {
            // Получаем имя привычки из элемента DOM
            let habitName = getHabitName(e)
            // Получаем объект привычки по имени
            let habit = getHabitByName(december, habitName)
            // Получаем день, по которому кликнули мышью
            let targetDay = e.target.innerText
            if (e.target.classList.contains("planned")) {
                e.target.classList.replace("planned", "done")
                // Добавляем текущий день в массив выполненных
                habit.setDayDone(targetDay)
            } else if (e.target.classList.contains("done")) {
                e.target.classList.replace("done", "undone")
                // Добавляем текущий день в массив невыполненных
                habit.setDayUndone(targetDay)
            } else if (e.target.classList.contains("undone")) {
                e.target.classList.remove("undone")
                // Удаляем текущий день из массива пропущенных
                habit.setDayNormal(targetDay)
            } else {
                e.target.classList.add("planned")
                // Добавляем текущий день в массив запланированных
                habit.setDayPlanned(targetDay)
            }
            // Сохраняем состояние месяца в локальное хранилище
            december.saveToLocalStorage()
        }
    }
    // Останавливаем распространение события вверх (поднятие)
    e.stopPropagation()
}

// Удаляет указанную привычку
// TODO: Переписать для произвольного месяца
// TODO: Запрашивать подтверждение, чтобы исключить случайное удаление!!!
function deleteHabit(e) {
    // Если клик был по кнопке delete нужно подняться по дереву выше,
    // чтобы найти наименование привычки
    if (e.target.classList.contains("habit-delete")) {
        let habitName = e.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.innerText
        // Получаем NodeList всех дивов с наименованиями привычек
        const habits = document.querySelectorAll("div .habit-name")
        // Перебираем NodeList для поиска указанной привычки
        for (const habit of habits) {
            // Если нашли нужную, удаляем её родителя из DOM,
            // так как он содержит div наименования и все дни этой привычки.
            if (habit.innerText === habitName) {
                habit.parentElement.remove()
            }
        }
        // Удаляем привычку из списка в текущем месяце в локальном хранилище
        december.deleteHabit(habitName)
    }
}

function init() {
    // Вешаем обработчик родительский элемент, который содержит все наши дни трекера
    let theMonthParent = document.querySelector("#month")
    theMonthParent.addEventListener("click", setHabitState, false)
    theMonthParent.addEventListener("click", deleteHabit, false)

    // Вешаем обработчик нажатия клавиш в поле input
    document.querySelector("#addHabit").addEventListener("keydown", addNewHabitHandler, false)

    // document.querySelectorAll("button .delete")
    // , deletHabitDOM, false)
}

document.addEventListener("DOMContentLoaded", init, false)