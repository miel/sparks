import { useLocalStorage } from './useLocalStorage'

export function useStreak() {
  const [streak, setStreak] = useLocalStorage('sparks_streak', { count: 0, lastDate: null })

  const today = new Date().toISOString().split('T')[0]

  function checkAndUpdateStreak() {
    if (streak.lastDate === today) return streak.count

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const newCount = streak.lastDate === yesterdayStr ? streak.count + 1 : 1
    setStreak({ count: newCount, lastDate: today })
    return newCount
  }

  return { streak, checkAndUpdateStreak, today }
}
