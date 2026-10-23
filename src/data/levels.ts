/**
 * Шкала уровней LifeQuest.
 *
 * Каждый следующий уровень требует одинаковые 900 XP — это та же шкала,
 * которая использовалась в демо-данных (7 уровень: 540 / 900 XP).
 * Уровень 1 начинается с 0 XP, уровень 2 — с 900 XP и так далее.
 */
export const XP_PER_LEVEL = 900

export interface LevelProgress {
  level: number
  xp: number
  xpToNext: number
  totalXp: number
}

export function getLevelProgress(totalXp: number): LevelProgress {
  const safeTotal = Number.isFinite(totalXp) ? Math.max(0, Math.floor(totalXp)) : 0

  return {
    level: Math.floor(safeTotal / XP_PER_LEVEL) + 1,
    xp: safeTotal % XP_PER_LEVEL,
    xpToNext: XP_PER_LEVEL,
    totalXp: safeTotal,
  }
}

export function getTotalXpForLevel(level: number): number {
  return Math.max(0, Math.floor(level) - 1) * XP_PER_LEVEL
}
