const december = [
    {
        name: "JavaScript",
        planned: [0, 3, 10, 30],
        done: [5, 15],
        undone: [18, 27]
    },
    {
        name: "Golang",
        planned: [0, 5, 10, 21],
        done: [3, 15],
        undone: [18, 27]
    }
]

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
        for (let j = 0; j < 31; j++) {
            html = html + `\t<div class="column is-narrow tracker">
        ${(j + 1).toString().padStart(2, 0)}
    </div>
`;
        }
        html = html + "</div>\n";
    }

    console.log(html);
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