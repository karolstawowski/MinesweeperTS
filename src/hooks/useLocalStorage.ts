import { useEffect, useState } from 'react'

const getLocalStorageValue = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key)

  if (item) {
    return JSON.parse(item) as T
  }

  return defaultValue
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: React.SetStateAction<T>) => void] => {
  const [value, setValue] = useState<T>(() =>
    getLocalStorageValue(key, defaultValue)
  )

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
