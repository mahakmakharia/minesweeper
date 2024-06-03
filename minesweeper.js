export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
};

export function getGameBoard(boardSize, noOfMines) {
  const board = [];
  const mines = getMineTilePositions(boardSize, noOfMines);
  console.log(mines);
  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const div = document.createElement('div');
      div.dataset.status = TILE_STATUSES.HIDDEN;
      const tile = {
        x,
        y,
        element: div,
        mine: mines.some(matchPositions.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return;
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
  } else {
    tile.status = TILE_STATUSES.MARKED;
  }
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  if (tile.mine) {
    tile.element.textContent = '💣';
    tile.status = TILE_STATUSES.MINE;
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
  }
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

function getMineTilePositions(boardSize, noOfMines) {
  const mines = [];
  while (mines.length < noOfMines) {
    const x = getRandomNumber(boardSize);
    const y = getRandomNumber(boardSize);
    if (!mines.some(matchPositions.bind(null, { x, y }))) {
      mines.push({ x, y });
    }
  }
  return mines;
}

function matchPositions(a, b) {
  return a.x === b.x && a.y === b.y;
}

function getRandomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, tile) {
  let tiles = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const temp = board[tile.x + i]?.[tile.y + j];
      if (temp) tiles.push(temp);
    }
  }
  return tiles;
}
