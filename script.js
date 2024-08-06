document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const calcType = urlParams.get('type');
    const calculationTitle = document.getElementById('calculationTitle');
    const inputFields = document.getElementById('inputFields');

    switch (calcType) {
        case 'molecularWeight':
            calculationTitle.innerText = 'Визначення молекулярної маси';
            inputFields.innerHTML = `
                <label for="compound">Введіть хімічну формулу сполуки:</label>
                <input type="text" id="compound">
            `;
            break;
        case 'massPercentage':
            calculationTitle.innerText = 'Визначення масових часток елементів';
            inputFields.innerHTML = `
                <label for="compound">Введіть хімічну формулу сполуки:</label>
                <input type="text" id="compound">
            `;
            break;
        case 'solutionMassFraction':
            calculationTitle.innerText = 'Визначення масової частки розчиненої речовини';
            inputFields.innerHTML = `
                <label for="soluteMass">Маса розчиненої речовини (г):</label>
                <input type="number" id="soluteMass">
                <label for="solventMass">Маса розчинника (г):</label>
                <input type="number" id="solventMass">
            `;
            break;
        default:
            calculationTitle.innerText = 'Хімічний калькулятор';
            inputFields.innerHTML = '';
            break;
    }
});

function calculate() {
    const urlParams = new URLSearchParams(window.location.search);
    const calcType = urlParams.get('type');
    let resultText = '';

    switch (calcType) {
        case 'molecularWeight':
            const compound = document.getElementById('compound').value;
            // Додайте ваш код для розрахунку молекулярної маси тут
            resultText = `Результат для формули ${compound}: ...`;
            break;
        case 'massPercentage':
            const compoundMass = document.getElementById('compound').value;
            // Додайте ваш код для розрахунку масових часток тут
            resultText = `Результат для формули ${compoundMass}: ...`;
            break;
        case 'solutionMassFraction':
            const soluteMass = parseFloat(document.getElementById('soluteMass').value);
            const solventMass = parseFloat(document.getElementById('solventMass').value);
            const fraction = (soluteMass / (soluteMass + solventMass)) * 100;
            resultText = `Масова частка розчиненої речовини: ${fraction.toFixed(2)}%`;
            break;
        default:
            resultText = 'Невідомий тип розрахунку';
            break;
    }

    document.getElementById('result').innerText = resultText;
}
