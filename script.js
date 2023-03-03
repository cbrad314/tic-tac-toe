"use strict";
//create the board with a 3 x 3 grid using a 2d array
const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  const createBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        j % 2 === 0 ? (board[i][j] = "") : (board[i][j] = "");
      }
    }
    return board;
  };

  return { createBoard };
})();

const displayController = (() => {
  const boardDiv = document.querySelector(".board");
  const board = gameBoard.createBoard();
  const drawBoard = () => {
    board.forEach((row, i) => {
      const newRow = document.createElement("div");
      newRow.classList.add("row", "row-col-3", "g-0");
      row.forEach((column, j) => {
        const newCol = document.createElement("div");
        const newColBtn = document.createElement("button");
        newCol.classList.add("col", "border");
        newColBtn.dataset.col = j;
        newColBtn.dataset.row = i;
        if (j === row.length - 1) {
          newCol.classList.add("border-end-0");
        }
        if (j === 0) {
          newCol.classList.add("border-start-0");
        }
        if (i === board.length - 1) {
          newCol.classList.add("border-bottom-0");
        }
        if (i === 0) {
          newCol.classList.add("border-top-0");
        }
        newColBtn.classList.add(
          "btn",
          "cell",
          "btn-light",
          "py-5",
          "w-100",
          "btn-lg",
          "h-100"
        );
        newColBtn.textContent = column;
        newColBtn.addEventListener("click", gameController.addMarkToCell);
        newCol.appendChild(newColBtn);
        newRow.appendChild(newCol);
      });
      boardDiv.appendChild(newRow);
    });
  };

  return { drawBoard };
})();

const gameController = (() => {
  const Player = (mark) => {
    const getMark = () => mark;

    return { getMark };
  };

  let currentPlayer;
  let playerOne;
  let playerTwo;

  const initializeGame = () => {
    playerOne = Player("X");
    playerTwo = Player("O");
    currentPlayer = playerOne;
  };

  const addMarkToCell = (e) => {
    if (!e.target.textContent) {
      const mark = currentPlayer.getMark();
      e.target.textContent = mark;
      e.target.dataset.value = mark;
      checkGameStatus(mark, e.target);
      _switchPlayer();
    }
  };
  const _switchPlayer = () => {
    currentPlayer === playerOne
      ? (currentPlayer = playerTwo)
      : (currentPlayer = playerOne);
  };

  const checkGameStatus = (mark, selectedCell) => {
    const row = selectedCell.dataset.row;
    const column = selectedCell.dataset.col;
    const cellsData = getCellsData();
    let gameStatus;

    if (_rowWinCheck(mark, row, cellsData)) {
      gameStatus = mark;
      _getWinningCells("row", row);
    }
    if (_columnWinCheck(mark, column, cellsData)) {
      gameStatus = mark;
      _getWinningCells("col", column);
    }
    if (_diagWinCheck(mark, cellsData)) {
      gameStatus = mark;
      _getWinningCells("diagonal");
    }
    if (_reverseDiagWinCheck(mark, cellsData)) {
      gameStatus = mark;
      _getWinningCells("reverseDiagonal");
    }

    if (_tieCheck(cellsData)) {
      gameStatus = "tie";
    }
    if (gameStatus) {
      _disableCells();
    }
  };

  const _rowWinCheck = (mark, row, cellsData) => {
    const markMatchedCellsInRow = cellsData.filter((cell) => {
      if (cell.dataset.row === row && cell.dataset.value === mark) return true;
    });

    if (markMatchedCellsInRow.length === 3) return markMatchedCellsInRow;
  };

  const _columnWinCheck = (mark, column, cellsData) => {
    const markMatchedCellsInColumn = cellsData.filter((cell) => {
      if (cell.dataset.col === column && cell.dataset.value === mark)
        return true;
    });
    if (markMatchedCellsInColumn.length === 3) return markMatchedCellsInColumn;
  };

  const _diagWinCheck = (mark, cellsData) => {
    const markMatchedCellsOnDiag = cellsData.filter((cell) => {
      if (
        cell.dataset.value === mark &&
        cell.dataset.col === cell.dataset.row
      ) {
        return true;
      }
    });
    if (markMatchedCellsOnDiag.length === 3) return markMatchedCellsOnDiag;
  };

  const _reverseDiagWinCheck = (mark, cellsData) => {
    const markMatchedCellsOnReverseDiag = cellsData.filter((cell) => {
      if (
        cell.dataset.value === mark &&
        ((cell.dataset.col === "2" && cell.dataset.row === "0") ||
          (cell.dataset.col === "0" && cell.dataset.row === "2") ||
          (cell.dataset.col === "1" && cell.dataset.row === "1"))
      ) {
        return true;
      }
    });
    if (markMatchedCellsOnReverseDiag.length === 3)
      return markMatchedCellsOnReverseDiag;
  };
  const getCellsData = () => {
    return Array.from(document.querySelectorAll(".cell"));
  };

  const _tieCheck = (cellsData) => {
    return cellsData.every((cell) => cell.dataset.value);
  };

  const _disableCells = () => {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.disabled = true;
      cell.classList.add("btn-secondary");
      cell.classList.remove("btn-light");
    });
  };

  const _colorWinningCell = (cell) => {
    cell.classList.remove("btn-light");
    cell.classList.add("btn-success");
  };

  const _getWinningCells = (winType, val = null) => {
    const cells = document.querySelectorAll(".cell");
    if (winType === "row" || winType === "col") {
      cells.forEach((cell) => {
        if (cell.dataset[winType] === val) {
          _colorWinningCell(cell);
        }
        return;
      });
    } else if (winType === "diagonal") {
      cells.forEach((cell) => {
        if (cell.dataset.col === cell.dataset.row) {
          _colorWinningCell(cell);
        }
        return;
      });
    } else if (winType === "reverseDiagonal") {
      cells.forEach((cell) => {
        if (
          (cell.dataset.col === "2" && cell.dataset.row === "0") ||
          (cell.dataset.col === "0" && cell.dataset.row === "2") ||
          (cell.dataset.col === "1" && cell.dataset.row === "1")
        ) {
          _colorWinningCell(cell);
        }
        return;
      });
    }
  };

  return {
    addMarkToCell,
    getCellsData,
    initializeGame,
  };
})();

displayController.drawBoard();
gameController.initializeGame();
