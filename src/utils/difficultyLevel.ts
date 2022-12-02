export type DiffucultyLevelType = {
  level: number
  boardWidth: number
  boardHeight: number
  minesNumber: number
}

export const difficultyLevels: DiffucultyLevelType[] = [
  { level: 1, boardWidth: 8, boardHeight: 8, minesNumber: 10 },
  { level: 2, boardWidth: 16, boardHeight: 16, minesNumber: 40 },
  { level: 3, boardWidth: 30, boardHeight: 16, minesNumber: 99 },
]
