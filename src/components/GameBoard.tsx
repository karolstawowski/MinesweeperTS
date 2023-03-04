import { DiffucultyLevelType } from '../utils/difficultyLevel'
import { CellType, GameStatus } from '../utils/game'
import { Cell } from './Cell'

type GameBoardProps = {
  cells: CellType[][]
  gameDifficultyLevel: DiffucultyLevelType
  gameStatus: GameStatus
  onCellRightClick: (x: number, y: number) => void
  onCellLeftClick: (cells: CellType[][], x: number, y: number) => void
}

export const GameBoard = ({
  gameDifficultyLevel,
  cells,
  gameStatus,
  onCellLeftClick,
  onCellRightClick,
}: GameBoardProps): JSX.Element => {
  return (
    <div className="flex justify-center select-none">
      <div
        style={{
          gridTemplateColumns: `repeat(${gameDifficultyLevel.boardWidth}, minmax(0, 1fr))`,
        }}
        className="grid gap-1 p-2 md:p-2 lg:p-3 bg-slate-700"
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
              x={i}
              y={j}
            />
          ))
        )}
      </div>
    </div>
  )
}
