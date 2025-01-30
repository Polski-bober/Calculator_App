let result = [];
let displayField = document.getElementById("field");

function updateDisplay() {
    displayField.value = result.join(' ');
}

function calcAddNum(num) {
    if (result.length === 0 || isOperator(result[result.length - 1]) || result[result.length - 1] === '(') {
        result.push(num.toString());
    } else {
        result[result.length - 1] += num.toString();
    }
    updateDisplay();
}

function calcAddOperator(operator) {
    if (result.length > 0 && !isOperator(result[result.length - 1]) || operator === '(' || operator === '√') {
        result.push(operator);
        updateDisplay();
    }
}

function isOperator(token) {
    return ["+", "-", "x", "/", "%", "(", ")", "²", "√"].includes(token);
}


function clearCalculator() {
    result = [];
    updateDisplay();
}

function evaluateExpression() {
    try {
        let expression = result.join('');
        expression = expression.replace(/x/g, '*'); // Replace 'x' with '*' for multiplication
        expression = expression.replace(/²/g, '**2'); // Replace 'x²' with '**2' for square

        // Handle square root: Replace '√number' with 'Math.sqrt(number)'
        expression = expression.replace(/√(\d+)/g, 'Math.sqrt($1)');

        // Handle implicit multiplication for brackets
        expression = expression.replace(/(\d+)\(/g, '$1*('); // Add '*' between number and '('
        expression = expression.replace(/\)(\d+)/g, ')*$1'); // Add '*' between ')' and number
        expression = expression.replace(/\)\(/g, ')*('); // Add '*' between ')' and '('

        let evaluatedResult = eval(expression);
        result = [evaluatedResult.toString()];
        updateDisplay();
    } catch (error) {
        alert("Invalid expression: " + error + ".\nPlease clear the calculator and try again.");
    }
}

// Event listeners for buttons
document.getElementById("clear").onclick = clearCalculator;
document.getElementById("equal").onclick = evaluateExpression;

// Add event listeners for numbers and operators
for (let i = 0; i <= 9; i++) {
    document.getElementById(i.toString()).onclick = () => calcAddNum(i);
}
document.getElementById("dot").onclick = () => calcAddNum('.');

let bracketState = true; // true for '(', false for ')'
["plus", "minus", "asterisk", "divide", "brackets", "square", "sqrt"].forEach(op => {
    document.getElementById(op).onclick = () => {
        if (op === "brackets") {
            calcAddOperator(bracketState ? '(' : ')');
            bracketState = !bracketState;
        } else if (op === "square") {
            calcAddOperator('²');
        } else if (op === "sqrt") {
            calcAddOperator('√');
        } else {
            calcAddOperator(op === "asterisk" ? "x" : op === "divide" ? "/" : op === "plus" ? "+" : "-");
        }
    };
});