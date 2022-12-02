import { MouseEvent } from 'react'
import { CellType } from '../utils/game'

type CellProps = {
  onCellLeftClick: () => void
  onCellRightClick: () => void
  isGameWon: boolean
} & CellType

export const Cell = ({
  onCellLeftClick,
  onCellRightClick,
  isGameWon,
  isMine,
  isOpen,
  isMarked,
  minesAround,
}: CellProps): JSX.Element => {
  const handleRightClick = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ): void => {
    e.preventDefault()
    onCellRightClick()
  }

  return (
    <a
      style={{ color: getCellTextColor(minesAround) }}
      className={`${getCellBackgroundColor(
        isOpen,
        isMine
      )} font-extrabold w-5 h-5 text-sm lg:w-7 lg:h-7 xl:w-8 xl:h-8 lg:text-xl text-center hover:cursor-pointer xl:text-2xl`}
      onClick={onCellLeftClick}
      onContextMenu={(
        e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
      ): void => handleRightClick(e)}
    >
      {getCellText(isGameWon, isOpen, isMarked, isMine, minesAround)}
    </a>
  )
}

const getCellBackgroundColor = (isOpen: boolean, isMine: boolean): string => {
  return isMine && isOpen
    ? 'bg-red-500'
    : isOpen
    ? 'bg-neutral-400'
    : 'bg-neutral-200'
}

const getCellTextColor = (minesAround: number): string => {
  const textColors: { [key: number]: string } = {
    1: '#0000C2',
    2: '#007F00',
    3: '#FF0000',
    4: '#000080',
    5: '#7F0000',
    6: '#008080',
    7: '#000000',
    8: '#808080',
  }

  return textColors[minesAround]
}

const getCellText = (
  isGameWon: boolean,
  isOpen: boolean,
  isMarked: boolean,
  isMine: boolean,
  minesAround: number
): string => {
  if (isOpen && isMine) {
    return '💣'
  }
  if (isOpen) {
    if (minesAround === 0) return ''
    return minesAround.toString()
  }
  if (isMarked) {
    return '🚩'
  }
  if (isGameWon && isMine) {
    return '💣'
  }
  return ''
}
