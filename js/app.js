import { createCalculator } from './calculator.js';

const calculator = createCalculator();
const resultElement = document.querySelector('#result');
const expressionElement = document.querySelector('#expression');
const buttons = document.querySelectorAll('button');

function render() {
  resultElement.textContent = calculator.getDisplayValue();
  expressionElement.textContent = calculator.getExpressionValue();
}

function handleButtonClick(button) {
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'clear') {
    calculator.clear();
    render();
    return;
  }

  if (action === 'clear-entry') {
    calculator.clearEntry();
    render();
    return;
  }

  if (action === 'operator') {
    calculator.setOperator(value);
    render();
    return;
  }

  if (action === 'decimal') {
    calculator.appendDecimal();
    render();
    return;
  }

  if (action === 'calculate') {
    calculator.calculate();
    render();
    return;
  }

  if (action === 'scientific') {
    calculator.applyScientificFunction(value);
    render();
    return;
  }

  if (action === 'number') {
    calculator.appendDigit(value);
    render();
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => handleButtonClick(button));
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    calculator.appendDigit(key);
    render();
    return;
  }

  if (key === '.') {
    calculator.appendDecimal();
    render();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    calculator.setOperator(key);
    render();
    return;
  }

  if (key === 'Enter' || key === '=') {
    calculator.calculate();
    render();
    return;
  }

  if (key === 'Escape') {
    calculator.clear();
    render();
    return;
  }

  if (key === 'Backspace') {
    calculator.clearEntry();
    render();
  }
});

render();
