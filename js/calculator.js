function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = Number(value.toFixed(12));
  if (rounded === 0) {
    return '0';
  }

  return String(rounded);
}

function calculateWithValues(firstValue, secondValue, operator) {
  switch (operator) {
    case '+':
      return firstValue + secondValue;
    case '-':
      return firstValue - secondValue;
    case '*':
      return firstValue * secondValue;
    case '/':
      if (secondValue === 0) {
        return 'Error';
      }
      return firstValue / secondValue;
    default:
      return secondValue;
  }
}

export function createCalculator() {
  const state = {
    firstValue: null,
    operator: null,
    waitingForSecondValue: false,
    displayValue: '0',
    expressionValue: '',
  };

  function clear() {
    state.firstValue = null;
    state.operator = null;
    state.waitingForSecondValue = false;
    state.displayValue = '0';
    state.expressionValue = '';
  }

  function clearEntry() {
    state.displayValue = '0';
    state.expressionValue = '';
    state.waitingForSecondValue = false;
  }

  function appendDigit(digit) {
    if (state.displayValue === 'Error') {
      state.displayValue = '0';
      state.expressionValue = '';
    }

    if (state.waitingForSecondValue) {
      state.displayValue = digit;
      state.waitingForSecondValue = false;
      return state.displayValue;
    }

    if (state.displayValue === '0') {
      state.displayValue = digit;
    } else {
      state.displayValue += digit;
    }

    return state.displayValue;
  }

  function appendDecimal() {
    if (state.displayValue === 'Error') {
      state.displayValue = '0';
    }

    if (state.waitingForSecondValue) {
      state.displayValue = '0.';
      state.waitingForSecondValue = false;
      return state.displayValue;
    }

    if (!state.displayValue.includes('.')) {
      state.displayValue += '.';
    }

    return state.displayValue;
  }

  function setOperator(nextOperator) {
    if (state.displayValue === 'Error') {
      return state.displayValue;
    }

    const currentValue = Number(state.displayValue);

    if (state.operator && !state.waitingForSecondValue) {
      const result = calculateWithValues(state.firstValue, currentValue, state.operator);
      state.displayValue = formatNumber(result);
      state.firstValue = result;
    } else if (state.firstValue === null) {
      state.firstValue = currentValue;
    } else {
      state.firstValue = currentValue;
    }

    state.operator = nextOperator;
    state.waitingForSecondValue = true;
    state.expressionValue = `${formatNumber(state.firstValue)} ${nextOperator}`;
    return state.displayValue;
  }

  function calculate() {
    if (state.displayValue === 'Error' || state.operator === null || state.firstValue === null) {
      return state.displayValue;
    }

    const currentValue = Number(state.displayValue);
    const result = calculateWithValues(state.firstValue, currentValue, state.operator);

    if (result === 'Error') {
      state.displayValue = 'Error';
      state.expressionValue = '0으로 나눌 수 없습니다.';
      state.firstValue = null;
      state.operator = null;
      state.waitingForSecondValue = true;
      return state.displayValue;
    }

    state.displayValue = formatNumber(result);
    state.expressionValue = `${formatNumber(state.firstValue)} ${state.operator} ${formatNumber(currentValue)} =`;
    state.firstValue = result;
    state.operator = null;
    state.waitingForSecondValue = true;
    return state.displayValue;
  }

  function applyScientificFunction(name) {
    if (state.displayValue === 'Error') {
      return state.displayValue;
    }

    const currentValue = Number(state.displayValue);
    let result;

    switch (name) {
      case 'sqrt':
        if (currentValue < 0) {
          result = 'Error';
          break;
        }
        result = Math.sqrt(currentValue);
        break;
      case 'sin':
        result = Math.sin(currentValue);
        break;
      case 'cos':
        result = Math.cos(currentValue);
        break;
      case 'tan':
        result = Math.tan(currentValue);
        break;
      case 'square':
        result = currentValue ** 2;
        break;
      case 'pi':
        result = Math.PI;
        break;
      default:
        result = currentValue;
    }

    if (result === 'Error' || !Number.isFinite(result)) {
      state.displayValue = 'Error';
      state.expressionValue = '계산할 수 없는 값입니다.';
      state.firstValue = null;
      state.operator = null;
      state.waitingForSecondValue = true;
      return state.displayValue;
    }

    state.displayValue = formatNumber(result);
    state.expressionValue = `${name}(${formatNumber(currentValue)})`;
    state.firstValue = result;
    state.operator = null;
    state.waitingForSecondValue = true;
    return state.displayValue;
  }

  return {
    clear,
    clearEntry,
    appendDigit,
    appendDecimal,
    setOperator,
    calculate,
    applyScientificFunction,
    getDisplayValue: () => state.displayValue,
    getExpressionValue: () => state.expressionValue,
  };
}
