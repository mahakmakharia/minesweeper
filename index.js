import {
  TILE_STATUSES,
  checkLose,
  checkWin,
  getGameBoard,
  markTile,
  revealTile,
} from './minesweeper.js';

const NO_OF_TILES = 10,
  NO_OF_MINES = 10;

const boardElement = document.querySelector('.board');
const subtitleElement = document.querySelector('.subtitle');
boardElement.style.setProperty('--size', NO_OF_TILES);
subtitleElement.textContent = `Mines left: ${NO_OF_MINES}`;

const board = getGameBoard(NO_OF_TILES, NO_OF_MINES);
board.forEach((row) => {
  row.forEach((tile) => {
    tile.element.addEventListener('click', () => {
      revealTile(board, tile);
      checkWinGame();
    });
    tile.element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
    boardElement.appendChild(tile.element);
  });
});

function listMinesLeft() {
  const markedTilesCount = board.reduce(
    (count, row) =>
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length,
    0
  );
  subtitleElement.textContent = `Mines left: ${NO_OF_MINES - markedTilesCount}`;
}

function checkWinGame() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true });
    boardElement.addEventListener('contextmenu', stopProp, { capture: true });
  }

  if (win) {
    subtitleElement.textContent = 'You win';
    return;
  }

  if (lose) {
    subtitleElement.textContent = 'You lose';
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
