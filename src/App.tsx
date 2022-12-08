import { useEffect, useRef, useState } from 'react'
import { Cell } from './components/Cell'
import { DifficultyLevelButton } from './components/DifficultyLevelButton'
import { difficultyLevels, DiffucultyLevelType } from './utils/difficultyLevel'
import {
  CellType,
  countFlaggedCells,
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
  const initialGameBoard = generateCells(
    difficultyLevel.boardWidth,
    difficultyLevel.boardHeight
  )

  const [cells, setCells] = useState<CellType[][]>(initialGameBoard)
  const [firstCell, setFirstCell] = useState<
    { x: number; y: number } | undefined
  >()
  const [gameDuration, setGameDuration] = useState<number>(0)
  const gameInterval = useRef<number>()

  const changeDifficultyLevel = (
    difficultyLevel: DiffucultyLevelType
  ): void => {
    setGameStatus(GameStatus.GameWorks)
    setDifficultyLevel(difficultyLevel)
    setFirstCell(undefined)
    setCells(
      generateCells(difficultyLevel.boardWidth, difficultyLevel.boardHeight)
    )
  }

  const onCellLeftClick = (board: CellType[][], x: number, y: number): void => {
    let newCells
    if (firstCell === undefined) {
      setFirstCell({ x, y })
      newCells = generateMines(cells, difficultyLevel, { x, y })
      setCells(newCells)

      gameInterval.current = setInterval(() => {
        setGameDuration((gameDuration) => gameDuration + 1)
      }, 1000)
    }
    if (gameStatus === GameStatus.GameWorks) {
      const [newBoard, newGameStatus] = openCells(
        newCells ?? board,
        x,
        y,
        difficultyLevel
      )

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
    clearInterval(gameInterval.current)
    setCells(initialGameBoard)
    setGameStatus(GameStatus.GameWorks)
    setFirstCell(undefined)
    setGameDuration(0)
  }

  useEffect(() => {
    if (
      gameStatus === GameStatus.GameOver ||
      gameStatus === GameStatus.GameWon
    ) {
      clearInterval(gameInterval.current)
    }
  }, [gameStatus])

  return (
    <div className="flex flex-col flex-wrap items-center content-center justify-center min-h-screen text-white bg-slate-800">
      <div className="md:[&>*]:mx-2 lg:[&>*]:mx-4 xl:[&>*]:mx-8 flex md:block flex-col">
        <div className="order-1 inline-block w-full mt-1 mb-3 text-center md:m-0 md:w-auto">
          <h3 className="md:w-32">Time</h3>
          <h4>{gameDuration}</h4>
        </div>
        <div className="inline-block w-50 md:w-auto">
          <h1 className="text-2xl text-center md:text-4xl">
            {gameStatusInformation(gameStatus)}
          </h1>
          <h2
            className="px-3 py-1 my-2 font-medium text-center rounded-md cursor-pointer md:my-3 md:text-xl bg-slate-700 hover:bg-slate-500"
            onClick={onGameRestart}
          >
            Restart game
          </h2>
        </div>
        <div className="inline-block w-full text-center md:w-auto">
          <h3 className="md:w-32">Flags placed (mines)</h3>
          <h4>
            {countFlaggedCells(cells)} ({difficultyLevel.minesNumber})
          </h4>
        </div>
      </div>

      <div className="flex justify-center select-none">
        <div
          style={{
            gridTemplateColumns: `repeat(${difficultyLevel.boardWidth}, minmax(0, 1fr))`,
          }}
          className="grid gap-[2px] p-1 md:p-2 lg:p-3 md:gap-1 bg-slate-700"
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
      </div>

      <div className="flex justify-center w-full mt-3 md:text-xl">
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

      <h3 className="mt-1 md:text-lg">Difficulty Level</h3>
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
