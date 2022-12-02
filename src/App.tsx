import { useState } from 'react'
import { Cell } from './components/Cell'
import { DifficultyLevelButton } from './components/DifficultyLevelButton'
import { difficultyLevels, DiffucultyLevelType } from './utils/difficultyLevel'
import {
  CellType,
  GameStatus,
  generateCells,
  generateMines,
  openCells,
  placeMarker,
} from './utils/game'

export const App = (): JSX.Element => {
  const [difficultyLevel, setDifficultyLevel] = useState<DiffucultyLevelType>(
    difficultyLevels[0]
  )
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.GameWorks)
  const initialGameBoard = generateMines(
    generateCells(difficultyLevel.boardWidth, difficultyLevel.boardHeight),
    difficultyLevel
  )
  const [cells, setCells] = useState<CellType[][]>(initialGameBoard)

  const changeDifficultyLevel = (
    difficultyLevel: DiffucultyLevelType
  ): void => {
    setGameStatus(GameStatus.GameWorks)
    setDifficultyLevel(difficultyLevel)
    setCells(
      generateMines(
        generateCells(difficultyLevel.boardWidth, difficultyLevel.boardHeight),
        difficultyLevel
      )
    )
  }

  const onCellLeftClick = (board: CellType[][], x: number, y: number): void => {
    if (gameStatus === GameStatus.GameWorks) {
      const [newBoard, newGameStatus] = openCells(board, x, y, difficultyLevel)

      if (newGameStatus) {
        setGameStatus(newGameStatus)
      }

      setCells(newBoard.slice())
    }
  }

  const onCellRightClick = (x: number, y: number): void => {
    setCells((cells) => placeMarker(cells, x, y))
  }

  const onGameRestart = (): void => {
    setCells(initialGameBoard)
    setGameStatus(GameStatus.GameWorks)
  }

  return (
    <div className="flex flex-col flex-wrap items-center content-center justify-center min-h-screen bg-slate-800">
      <h1 className="text-2xl text-white md:text-4xl">
        {gameStatusInformation(gameStatus)}
      </h1>

      <h2
        className="inline-block px-3 py-1 my-2 text-base font-medium text-center text-white rounded-md cursor-pointer md:my-3 md:text-xl bg-slate-700 hover:bg-slate-500"
        onClick={onGameRestart}
      >
        Restart game
      </h2>

      <div
        style={{
          gridTemplateColumns: `repeat(${difficultyLevel.boardWidth}, minmax(0, 1fr))`,
        }}
        className="grid gap-[2px] p-1 md:p-2 lg:p-3 text-white md:gap-1 bg-slate-700"
        onContextMenu={(
          e: React.MouseEvent<HTMLDivElement, MouseEvent>
        ): void => e.preventDefault()}
      >
        {cells.map((cellsRow, j) =>
          cellsRow.map((cell, i) => (
            <Cell
              key={j + i}
              onCellLeftClick={(): void => onCellLeftClick(cells, i, j)}
              onCellRightClick={(): void => onCellRightClick(i, j)}
              isGameWon={gameStatus === GameStatus.GameWon}
              isMine={cell.isMine}
              isOpen={cell.isOpen}
              isMarked={cell.isMarked}
              minesAround={cell.minesAround}
            />
          ))
        )}
      </div>

      <div className="flex justify-center w-full mt-3 text-base text-white md:text-xl">
        {difficultyLevels.map((difficultyLevel) => (
          <DifficultyLevelButton
            key={difficultyLevel.level}
            difficultyLevel={difficultyLevel.level}
            onSetDifficultyLevel={(): void =>
              changeDifficultyLevel(difficultyLevel)
            }
          />
        ))}
      </div>

      <h3 className="mt-1 text-base text-white md:text-lg">Difficulty Level</h3>
    </div>
  )
}

const gameStatusInformation = (gameStatus: GameStatus): string => {
  const gameInformation = {
    GameWorks: 'The game is on!',
    GameOver: 'Game Over!',
    GameWon: 'You won!',
  }

  return gameInformation[gameStatus]
}
