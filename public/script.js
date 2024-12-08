// add items from page
const amount = document.querySelector("#amount");
const from = document.querySelector("#from");
const to = document.querySelector("#to");
const swap = document.querySelector("#swap_button");
const submit = document.querySelector(".convert");

const resp_init = document.querySelector("#resp_init");
const resp_total = document.querySelector("#resp_total");
const resp_other = document.querySelector("#resp_other");

const convert_boxes = document.querySelector(".convert_boxes");





//button listener
swap.addEventListener("click", () => {
    let temp = from.value;
    from.value = to.value;
    to.value = temp;
})

submit.addEventListener("click", () => {
    if (isNaN(amount.value)) {
        alert("Please enter a valid number");
    } else {
        convert_boxes.innerHTML = "";
        drawResponse();
        drawBox(to.value, from.value);
        drawBox(from.value, to.value);
    }

})

const exchangeRates = {
    "base": 1,
    "date": "2022-09-24",
    "rates": {
        "AUD": 1.531863,
        "CAD": 1.36029,
        "CLP": 950.662057,
        "CNY": 7.128404,
        "EUR": 1.03203,
        "GBP": 0.920938,
        "INR": 81.255504,
        "JPY": 143.376504,
        "RUB": 57.875038,
        "USD": 1.0,
        "ZAR": 17.92624
    }
}

async function getData() {
    try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/dd5e7d4110155f0f4bb12db4/latest/USD')
        const data = await response.json();
        exchangeRates.rates.AUD = data.conversion_rates.AUD;
        exchangeRates.rates.CAD = data.conversion_rates.CAD;
        exchangeRates.rates.CLP = data.conversion_rates.CLP;
        exchangeRates.rates.CNY = data.conversion_rates.CNY;
        exchangeRates.rates.EUR = data.conversion_rates.EUR;
        exchangeRates.rates.GBP = data.conversion_rates.GBP;
        exchangeRates.rates.INR = data.conversion_rates.INR;
        exchangeRates.rates.JPY = data.conversion_rates.JPY;
        exchangeRates.rates.RUB = data.conversion_rates.RUB;
        exchangeRates.rates.ZAR = data.conversion_rates.ZAR;
    } catch (error) {
        console.error(error)
        alert("Error retrieving current exchange rates from API. Using logged past rates. Please try again later.")
    }
}

// validate number input
function validate() {

}

// convert function
function convert(amt, init, end) {
    return (amt / exchangeRates.rates[init]) * exchangeRates.rates[end];
}

// draw boxes
function drawResponse() {
    resp_init.innerText = `${amount.value} ${from.value} =`;
    resp_total.innerText = `${convert(amount.value, from.value, to.value).toFixed(6)} ${to.value}`;
    resp_other.innerText = `1 ${to.value} = ${convert(1, to.value, from.value).toFixed(6)} ${from.value}`;
}

function drawBox(curA, curB) {
    const convert_box = document.createElement("div")
    convert_box.classList.add("convert_box");

    const box_title = document.createElement("div")
    box_title.classList.add("box_title");
    convert_box.append(box_title);
    const bTitle = document.createElement("div")
    bTitle.classList.add("bTitle");
    bTitle.innerText = `Convert ${curA} to ${curB}`
    box_title.appendChild(bTitle);

    const box_heads = document.createElement("div")
    box_heads.classList.add("box_heads");
    convert_box.append(box_heads);
    const box_headA = document.createElement("div")
    box_headA.classList.add("box_head");
    box_headA.innerText = `${curA}`;
    const box_headB = document.createElement("div")
    box_headB.classList.add("box_head");
    box_headB.innerHTML = `${curB}`;
    box_heads.appendChild(box_headA);
    box_heads.appendChild(box_headB);

    let numbers = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

    for (let i = 0; i < 10; i++) {
        const box_line = document.createElement("div")
        box_line.classList.add("box_line");
        const box_itemA = document.createElement("div")
        box_itemA.classList.add("box_item");
        box_itemA.innerText = `${numbers[i]} ${curA}`;
        const box_itemB = document.createElement("div")
        box_itemB.classList.add("box_item");
        box_itemB.innerHTML = `${convert(numbers[i], curA, curB).toFixed(2)} ${curB}`;
        box_line.append(box_itemA);
        box_line.append(box_itemB);
        convert_box.append(box_line);
    }


    convert_boxes.appendChild(convert_box);
}

let promise = getData();