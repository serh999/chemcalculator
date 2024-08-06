document.addEventListener("DOMContentLoaded", () => {
    // Завантаження і обробка JSON
    fetch('atomicMasses.json')
        .then(response => response.json())
        .then(data => {
            window.atomicMasses = {};
            data.forEach(element => {
                window.atomicMasses[element.symbol] = element.atomic_mass;
            });
            initializePage();
        })
        .catch(error => console.error('Помилка завантаження JSON:', error));
});

function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const calculationType = urlParams.get('type');
    const inputFields = document.getElementById("inputFields");
    const calculationTitle = document.getElementById("calculationTitle");

    if (calculationType === "molecularWeight") {
        calculationTitle.innerText = "Визначення молекулярної маси";
        inputFields.innerHTML = '<input type="text" id="formula" placeholder="Введіть хімічну формулу">';
    } else if (calculationType === "massPercentage") {
        calculationTitle.innerText = "Визначення масових часток елементів";
        inputFields.innerHTML = '<input type="text" id="formula" placeholder="Введіть хімічну формулу">';
    } else if (calculationType === "solutionMassFraction") {
        calculationTitle.innerText = "Визначення масової частки розчиненої речовини";
        inputFields.innerHTML = `
            <input type="number" id="soluteMass" placeholder="Маса розчиненої речовини (г)" step="any">
            <input type="number" id="solventMass" placeholder="Маса розчинника (г)" step="any">
        `;
    } else {
        console.error("Невідомий тип розрахунку:", calculationType);
    }
}

function calculate() {
    const urlParams = new URLSearchParams(window.location.search);
    const calculationType = urlParams.get('type');

    if (calculationType === "molecularWeight") {
        calculateMolecularWeight();
    } else if (calculationType === "massPercentage") {
        calculateMassPercentage();
    } else if (calculationType === "solutionMassFraction") {
        calculateSolutionMassFraction();
    } else {
        console.error("Невідомий тип розрахунку:", calculationType);
    }
}

function calculateMolecularWeight() {
    const formula = document.getElementById("formula").value.trim();
    if (!formula) {
        document.getElementById("result").innerText = "Будь ласка, введіть формулу.";
        return;
    }

    const regex = /([A-Z][a-z]*)(\d*)/g;
    let result;
    let totalWeight = 0;

    while ((result = regex.exec(formula)) !== null) {
        const element = result[1];
        const count = result[2] ? parseInt(result[2]) : 1;
        if (window.atomicMasses[element]) {
            totalWeight += window.atomicMasses[element] * count;
        } else {
            document.getElementById("result").innerText = `Невідомий елемент: ${element}`;
            return;
        }
    }

    document.getElementById("result").innerText = `Молекулярна маса: ${totalWeight.toFixed(2)} г/моль`;
}

function calculateMassPercentage() {
    const formula = document.getElementById("formula").value.trim();
    if (!formula) {
        document.getElementById("result").innerText = "Будь ласка, введіть формулу.";
        return;
    }

    const regex = /([A-Z][a-z]*)(\d*)/g;
    let result;
    let totalWeight = 0;
    const elementCounts = {};

    while ((result = regex.exec(formula)) !== null) {
        const element = result[1];
        const count = result[2] ? parseInt(result[2]) : 1;
        if (window.atomicMasses[element]) {
            totalWeight += window.atomicMasses[element] * count;
            elementCounts[element] = (elementCounts[element] || 0) + count;
        } else {
            document.getElementById("result").innerText = `Невідомий елемент: ${element}`;
            return;
        }
    }

    let output = `Молекулярна маса: ${totalWeight.toFixed(2)} г/моль<br>Масові частки:<br>`;
    for (const element in elementCounts) {
        const elementWeight = window.atomicMasses[element] * elementCounts[element];
        const percentage = (elementWeight / totalWeight) * 100;
        output += `${element}: ${percentage.toFixed(2)}%<br>`;
    }

    document.getElementById("result").innerHTML = output;
}

function calculateSolutionMassFraction() {
    const soluteMass = parseFloat(document.getElementById("soluteMass").value);
    const solventMass = parseFloat(document.getElementById("solventMass").value);

    if (isNaN(soluteMass) || isNaN(solventMass) || soluteMass <= 0 || solventMass <= 0) {
        document.getElementById("result").innerText = "Будь ласка, введіть коректні значення мас.";
        return;
    }

    const solutionMass = soluteMass + solventMass;
    const massFraction = (soluteMass / solutionMass) * 100;

    document.getElementById("result").innerText = `Масова частка розчиненої речовини: ${massFraction.toFixed(2)}%`;
}
