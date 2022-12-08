import { DiffucultyLevelType } from './difficultyLevel'

export type CellType = {
  isOpen: boolean
  isMine: boolean
  isMarked: boolean
  minesAround: number
}

export enum GameStatus {
  GameWorks = 'GameWorks',
  GameOver = 'GameOver',
  GameWon = 'GameWon',
}

const neighboursLocations = [-1, 0, 1]

/**
 * @description Counts marked cells across the game board
 * @param  {CellType[][]} board
 * @returns {number} Number of marked cells
 */
export const countFlaggedCells = (board: CellType[][]): number => {
  return board
    .map((row) => row.filter((cell) => cell.isMarked).length)
    .reduce((num, a) => num + a, 0)
}

/**
 * @description Assigns mines to random cells of the game board
 * @param  {CellType[][]} board - Game board
 * @param  {DiffucultyLevelType} difficultyLevel- Difficulty level containing game board dimensions and number of mines to assign
 * @returns {CellType[][]} New game board
 */
export const generateMines = (
  board: CellType[][],
  difficultyLevel: DiffucultyLevelType,
  firstCell: { x: number; y: number }
): CellType[][] => {
  let numberOfGeneratedMines = 0

  const boardWidth = difficultyLevel.boardWidth
  const boardHeight = difficultyLevel.boardHeight
  const requiredNumberOfMines = difficultyLevel.minesNumber

  while (numberOfGeneratedMines < requiredNumberOfMines) {
    const x = Math.floor(Math.random() * boardWidth)
    const y = Math.floor(Math.random() * boardHeight)

    if (firstCell.x === x && firstCell.y === y) {
      continue
    }

    if (!board[y][x].isMine) {
      board[y][x].isMine = true
      numberOfGeneratedMines++
    }
  }

  board = setNumberOfMinesAround(board)

  return board
}

/**
 * @description Assigns number of neighbouring cells for each cell of the game board
 * @param  {CellType[][]} board - Game board
 * @returns {CellType[][]} New game board
 */
export const setNumberOfMinesAround = (board: CellType[][]): CellType[][] => {
  let minesCount = 0

  for (let i = 0; i < board[0].length; i++) {
    for (let j = 0; j < board.length; j++) {
      for (const row of neighboursLocations) {
        for (const col of neighboursLocations) {
          try {
            if (board[j + row][i + col].isMine) {
              if (row !== 0 || col !== 0) {
                minesCount++
              }
            }
          } catch {
            continue
          }
        }
      }

      board[j][i].minesAround = minesCount
      minesCount = 0
    }
  }

  return board
}

/**
 * @description Generates game board with dimensions of given parameters
 * @param  {number} boardWidth - Width of the game board
 * @param  {number} boardHeight - Height of the game board
 * @returns {CellType[][]} New game board
 */
export const generateCells = (
  boardWidth: number,
  boardHeight: number
): CellType[][] => {
  return [...Array(boardHeight).keys()].map(() =>
    [...Array(boardWidth).keys()].map(() => {
      return {
        isOpen: false,
        isMine: false,
        isMarked: false,
        minesAround: 0,
      }
    })
  )
}

/**
 * @description Sets all mine cells to open in game board
 * @param  {CellType[][]} board - Game board
 * @returns {CellType[][]} New game board
 */
export const openAllMineCells = (board: CellType[][]): CellType[][] => {
  return board.map((rowCells) =>
    rowCells.map((rowCell) => {
      return rowCell.isMine ? { ...rowCell, isOpen: true } : rowCell
    })
  )
}

/**
 * @description Opens recursively game board cells starting in [x, y] point - flood fill algorithm
 * @param  {CellType[][]} board - Game board
 * @param  {number} x - X-axis coordinates
 * @param  {number} y - Y-axis coordinates
 * @param  {DiffucultyLevelType} difficultyLevel - Game difficulty level
 * @returns {[CellType[][], GameStatus]} Array of new game board and new game status
 */
export const openCells = (
  board: CellType[][],
  x: number,
  y: number,
  difficultyLevel: DiffucultyLevelType
): [gameBoard: CellType[][], gameStatus: GameStatus] => {
  if (!board[y][x].isOpen && !board[y][x].isMarked) {
    if (board[y][x].isMine) {
      board = openAllMineCells(board)

      return [board, GameStatus.GameOver]
    } else {
      if (board[y][x].minesAround > 0) {
        board[y][x].isOpen = true

        const areAllNonMineCellsOpen =
          getNumberOfClosedCells(board) === difficultyLevel.minesNumber

        if (areAllNonMineCellsOpen) {
          return [board, GameStatus.GameWon]
        }
      } else {
        board[y][x].isOpen = true

        for (const row of neighboursLocations) {
          for (const col of neighboursLocations) {
            try {
              if (
                !board[y + row][x + col].isMarked &&
                !board[y + row][x + col].isOpen
              )
                openCells(board, x + col, y + row, difficultyLevel)
            } catch (err) {
              continue
            }
          }
        }
      }
    }
  }
  return [board, GameStatus.GameWorks]
}

/**
 * @description Gets number of closed cells across the game board
 * @param  {CellType[][]} board - Game board
 * @returns {number} Number of closed cells across the game board
 */
export const getNumberOfClosedCells = (board: CellType[][]): number => {
  return board
    .map((row) => row.filter((cell) => cell.isOpen === false).length)
    .reduce((num, a) => num + a, 0)
}

/**
 * @description Places marker on selected game board cell
 * @param  {CellType[][]} board - Game board
 * @param  {number} x - X-axis coordinates
 * @param  {number} y - Y-axis coordinates
 * @returns {CellType[][]} New game board
 */
export const placeMarker = (
  board: CellType[][],
  x: number,
  y: number
): CellType[][] => {
  return board.map((rowCells, j) =>
    rowCells.map((rowCell, i) => {
      return x === i && y === j
        ? rowCell.isOpen
          ? rowCell
          : { ...rowCell, isMarked: !rowCell.isMarked }
        : rowCell
    })
  )
}
