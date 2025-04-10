function hexToMatrix(hex) {
  const matrix = [[], [], [], []];
  for (let i = 0; i < 16; i++) {
    matrix[i % 4].push(hex.slice(i * 2, i * 2 + 2));
  }
  return matrix;
}

function matrixToHex(matrix) {
  return matrix.flat().join('').toUpperCase();
}

function displayMatrix(matrixId, data) {
  const matrix = document.getElementById(matrixId);
  matrix.innerHTML = '';
  data.forEach(row => {
    row.forEach(cell => {
      const div = document.createElement('div');
      div.textContent = cell.toUpperCase();
      matrix.appendChild(div);
    });
  });
}

function showStage(stageId, delay) {
  setTimeout(() => {
    document.getElementById(stageId).classList.add('show');
  }, delay);
}

function addRoundKey(stateMatrix, roundKeyMatrix) {
  const resultMatrix = [];
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      const stateByte = parseInt(stateMatrix[i][j], 16);
      const roundKeyByte = parseInt(roundKeyMatrix[i][j], 16);
      const xorResult = (stateByte ^ roundKeyByte).toString(16).padStart(2, '0').toUpperCase();
      row.push(xorResult);
    }
    resultMatrix.push(row);
  }
  return resultMatrix;
}

function startAESRound() {
  const defaultHex = "87F24D97EC6E4C904AC346E78CD895A6";
  const inputMatrix = hexToMatrix(defaultHex);
  document.getElementById("input-hex").textContent = defaultHex.toUpperCase();
  document.getElementById("output-hex").textContent = "...processing";

  document.querySelectorAll('.matrix-stage').forEach(el => el.classList.remove('show'));

  displayMatrix("input-matrix", inputMatrix);
  showStage("input-stage", 500);

  const subBytesMatrix = inputMatrix.map(row =>
    row.map(hex => (parseInt(hex, 16) ^ 0x63).toString(16).padStart(2, '0'))
  );
  setTimeout(() => displayMatrix("subbytes-matrix", subBytesMatrix), 1000);
  showStage("subbytes-stage", 1000);

  const shiftRowsMatrix = [
    subBytesMatrix[0],
    [...subBytesMatrix[1].slice(1), subBytesMatrix[1][0]],
    [...subBytesMatrix[2].slice(2), ...subBytesMatrix[2].slice(0, 2)],
    [...subBytesMatrix[3].slice(3), ...subBytesMatrix[3].slice(0, 3)]
  ];
  setTimeout(() => displayMatrix("shiftrows-matrix", shiftRowsMatrix), 3000);
  showStage("shiftrows-stage", 4000);

  const mixColumnsMatrix = shiftRowsMatrix.map(row =>
    row.map(hex => (parseInt(hex, 16) ^ 0x1F).toString(16).padStart(2, '0'))
  );
  setTimeout(() => displayMatrix("mixcolumns-matrix", mixColumnsMatrix), 5000);
  showStage("mixcolumns-stage", 5000);

  const roundKeyMatrix = [
    ["AC", "19", "28", "57"],
    ["77", "FA", "D1", "5C"],
    ["66", "DC", "29", "00"],
    ["F3", "21", "41", "6A"]
  ];

  setTimeout(() => displayMatrix("round-key", roundKeyMatrix), 6000);
  showStage("round-key", 6000);

  const outputMatrix = addRoundKey(mixColumnsMatrix, roundKeyMatrix);
  setTimeout(() => {
    displayMatrix("output-matrix", outputMatrix);
    document.getElementById("output-hex").textContent = matrixToHex(outputMatrix);
  }, 7000);
  showStage("output-stage", 7000);
}
