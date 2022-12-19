type DifficultyLevelButtonType = {
  difficultyLevel: number
  onSetDifficultyLevel: () => void
  isSelected: boolean
}

export const DifficultyLevelButton = ({
  difficultyLevel,
  onSetDifficultyLevel,
  isSelected,
}: DifficultyLevelButtonType): JSX.Element => {
  return (
    <button
      className={`${difficultyLevel === 3 ? 'hidden' : ''} ${
        isSelected ? 'bg-slate-500' : ''
      } md:block w-8 mx-1 text-center rounded-md cursor-pointer bg-slate-700 hover:bg-slate-400`}
      onClick={onSetDifficultyLevel}
    >
      {difficultyLevel}
    </button>
  )
}
