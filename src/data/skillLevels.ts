/**
 * Шкала уровней навыков LifeQuest.
 *
 * Она не связана с уровнем персонажа: переход с уровня L на L + 1 требует
 * 200 + 100 × L опыта. Навык 1 уровня начинает с 0 XP и растёт всё медленнее:
 * 300, 400, 500, 600… XP до следующего уровня.
 *
 * Такая шкала совпадает с исходными демо-данными навыков (например,
 * «Здоровье» 6 уровня с 640 / 800 XP), поэтому прогресс выглядит непрерывным.
 */
export interface SkillProgress {
  level: number
  xp: number
  xpToNext: number
  totalXp: number
}

export function getSkillXpToNext(level: number): number {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1
  return 200 + safeLevel * 100
}

/** Cumulative XP required to reach the given skill level. */
export function getTotalSkillXpForLevel(level: number): number {
  const steps = Number.isFinite(level) ? Math.max(0, Math.floor(level) - 1) : 0
  return 200 * steps + 100 * ((steps * (steps + 1)) / 2)
}

export function getSkillProgress(totalXp: number): SkillProgress {
  const safeTotal = Number.isFinite(totalXp) ? Math.max(0, Math.floor(totalXp)) : 0

  let level = 1
  let xp = safeTotal
  let xpToNext = getSkillXpToNext(level)

  while (xp >= xpToNext) {
    xp -= xpToNext
    level += 1
    xpToNext = getSkillXpToNext(level)
  }

  return { level, xp, xpToNext, totalXp: safeTotal }
}
