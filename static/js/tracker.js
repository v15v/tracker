const december = [
    {
        name: "Ранний подъём",
        planned: [0, 3, 10, 30],
        done: [5, 1],
        undone: [15, 7]
    },
    {
        name: "JavaScript",
        planned: [0, 3, 10, 30],
        done: [5, 15],
        undone: [18, 27]
    },
    {
        name: "Golang",
        planned: [0, 5, 10, 21],
        done: [3, 15, 8],
        undone: [11, 23]
    }
]
const monthDays = 31;

function setPlannedDone(e) {
    let classes = e.target.getAttribute("class");
    if (classes.includes("planned")) {
        e.target.classList.remove("planned");
        e.target.classList.add("done");
    } else if (classes.includes("undone")) {
        e.target.classList.remove("undone");
    } else if (classes.includes("done")) {
        e.target.classList.remove("done");
        e.target.classList.add("undone");
    } else {
        e.target.classList.add("planned");
    }
}

function makeMonth(month) {
    let html = "";
    for (let i = 0; i < month.length; i++) {
        html = html + `<div class="columns is-multiline is-mobile">
    <div class="column has-text-right tracker has-text-weight-bold">
        ${month[i].name} 
    </div>
`
        for (let j = 0; j < monthDays; j++) {
            function inArray(value) {
                return value === j;
            }

            let classes = "";
            // Проверяем наличие указанного дня в запланированных, выполненных или пропущенных
            if (month[i].planned.filter(inArray).length === 1) {
                classes = "column is-narrow tracker planned"
            } else if (month[i].done.filter(inArray).length === 1) {
                classes = "column is-narrow tracker done"
            } else if (month[i].undone.filter(inArray).length === 1) {
                classes = "column is-narrow tracker undone"
            } else {
                classes = "column is-narrow tracker"
            }
            html = html + `\t<div class="${classes}">
        ${(j + 1).toString().padStart(2, 0)}
    </div>
`;
        }
        html = html + "</div>\n";
    }

    // console.log(html);
    return html;
}

function init() {
    let html = makeMonth(december);
    let monthDiv = document.getElementById("month");
    let element = document.createElement("div");
    monthDiv.appendChild(element);
    element.outerHTML = html;

    let elements = document.getElementsByClassName("tracker");
    for (let i = 0; i < elements.length; i++) {
        // console.log(elements[i]);
        elements[i].onclick = setPlannedDone;
    }
}

window.onload = init;