type DifficultyLevelButtonType = {
  difficultyLevel: number
  onSetDifficultyLevel: () => void
}

export const DifficultyLevelButton = ({
  difficultyLevel,
  onSetDifficultyLevel,
}: DifficultyLevelButtonType): JSX.Element => {
  return (
    <a
      className={`${
        difficultyLevel === 3 ? 'hidden' : ''
      } md:block w-8 mx-1 text-center rounded-md cursor-pointer bg-slate-700 hover:bg-slate-500`}
      onClick={onSetDifficultyLevel}
    >
      {difficultyLevel}
    </a>
  )
}
