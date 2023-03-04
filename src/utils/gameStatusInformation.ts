import { GameStatus } from './game'

export const gameStatusInformation = (gameStatus: GameStatus): string => {
  const gameInformation = {
    GameWorks: 'Play!',
    GameOver: 'Game Over!',
    GameWon: 'You won!',
  }

  return gameInformation[gameStatus]
}
