function createSudokuBoard() {
  const table = document.createElement('table');
  table.classList.add('board');

  for (let line = 1; line <= 9; line++) {
    const tr = document.createElement('tr');
    for (let column = 1; column <= 9; column++) {
      const td = document.createElement('td');
      td.id = `cell-${line}-${column}`;
      td.classList.add('cell');
      const region = calculateRegion(line, column);
      td.dataset.line = line;
      td.dataset.column = column;
      td.dataset.region = region;

      const input = createCellInput(line, column, region);

      td.appendChild(input);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  //document.body.appendChild(table);
  document.getElementById('sudoku-container').appendChild(table);
}

function calculateRegion(line, column) {
  return Math.floor((line - 1) / 3) * 3 + Math.floor((column - 1) / 3) + 1;
}

function createCellInput(line, column, region) {
  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 1;
  input.classList.add('cell-input');

  input.dataset.line = line;
  input.dataset.column = column;
  input.dataset.region = region;

  addInputEventListeners(input);

  return input;
}

function addInputEventListeners(input) {
  input.addEventListener('keydown', handleKeyDown);
  input.addEventListener('paste', handlePaste);
  input.addEventListener('input', handleInput);
}

function handleKeyDown(e) {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

  if (allowedKeys.includes(e.key)) {
    return;
  }

  if (!/^[1-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

function handlePaste(e) {
  e.preventDefault();
  const pastedData = e.clipboardData.getData('text');
  const sanitizedData = pastedData.replace(/[^1-9]/g, '').substring(0, 1);
  e.target.value = sanitizedData;
}

function handleInput(e) {
  const sanitizedValue = e.target.value.replace(/[^1-9]/g, '').substring(0, 1);
  e.target.value = sanitizedValue;

  if (sanitizedValue) {
    const currentLine = e.target.dataset.line;
    const currentColumn = e.target.dataset.column;
    const currentRegion = e.target.dataset.region;

    const duplicateType = checkForDuplicates(e.target, sanitizedValue, currentLine, currentColumn, currentRegion);

    if (duplicateType) {
      displayError(e.target, `La valeur ${sanitizedValue} existe déjà dans la même ${duplicateType}.`);
      e.target.value = '';
    } else {
      clearError(e.target);
    }
  }
}

function checkForDuplicates(inputElement, value, line, column, region) {
  if (hasDuplicate(inputElement, `.cell-input[data-line="${line}"]`, value)) {
    return 'ligne';
  }
  if (hasDuplicate(inputElement, `.cell-input[data-column="${column}"]`, value)) {
    return 'colonne';
  }
  if (hasDuplicate(inputElement, `.cell-input[data-region="${region}"]`, value)) {
    return 'région';
  }
  return null;
}

function hasDuplicate(currentInput, selector, value) {
  const inputs = document.querySelectorAll(selector);

  for (let input of inputs) {
    if (input !== currentInput && input.value === value) {
      return true;
    }
  }
  return false;
}

function displayError(inputElement, message) {
  inputElement.classList.add('error');
}

function clearError(inputElement) {
  inputElement.classList.remove('error');
}

document.addEventListener('DOMContentLoaded', () => {

  createSudokuBoard();

});
