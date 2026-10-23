import {
  achievementDefinitions,
  initialAchievementDates,
  type AchievementCondition,
  type AchievementDefinition,
} from '../data/achievements'
import { getLevelProgress } from '../data/levels'
import { getSkillProgress } from '../data/skillLevels'
import type { Achievement, CategoryId, GameState } from '../types'

export interface AchievementSnapshot {
  questsCompleted: number
  characterLevel: number
  totalXp: number
  skillLevels: Record<CategoryId, number>
  categoryQuests: Record<CategoryId, number>
}

type AchievementSource = Pick<
  GameState,
  'totalXp' | 'questsCompleted' | 'skillXp' | 'categoryQuests'
>

export function getAchievementSnapshot(source: AchievementSource): AchievementSnapshot {
  const skillLevels = {} as Record<CategoryId, number>

  for (const category of Object.keys(source.skillXp) as CategoryId[]) {
    skillLevels[category] = getSkillProgress(source.skillXp[category]).level
  }

  return {
    questsCompleted: source.questsCompleted,
    characterLevel: getLevelProgress(source.totalXp).level,
    totalXp: source.totalXp,
    skillLevels,
    categoryQuests: source.categoryQuests,
  }
}

function getConditionCurrent(
  condition: AchievementCondition,
  snapshot: AchievementSnapshot,
): number {
  switch (condition.type) {
    case 'quests-completed':
      return snapshot.questsCompleted
    case 'character-level':
      return snapshot.characterLevel
    case 'skill-level':
      return Math.max(0, ...Object.values(snapshot.skillLevels))
    case 'total-xp':
      return snapshot.totalXp
    case 'category-quests':
      return snapshot.categoryQuests[condition.category] ?? 0
  }
}

export function getAchievementProgress(
  definition: AchievementDefinition,
  snapshot: AchievementSnapshot,
): { current: number; total: number } {
  const raw = getConditionCurrent(definition.condition, snapshot)
  const current = Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0
  const total = definition.condition.target

  return { current: Math.min(current, total), total }
}

export function isAchievementUnlocked(
  definition: AchievementDefinition,
  snapshot: AchievementSnapshot,
): boolean {
  const progress = getAchievementProgress(definition, snapshot)
  return progress.current >= progress.total
}

/**
 * Keeps dates for already earned achievements and fills in the ones whose
 * conditions are met. This is used when loading saves created before
 * achievements existed, so old progress is recognized without duplicate XP.
 */
export function reconcileAchievementDates(
  dates: Record<string, string>,
  snapshot: AchievementSnapshot,
  preferredDates: Record<string, string> = initialAchievementDates,
  fallbackDate: string = getTodayIsoDate(),
): Record<string, string> {
  const next = { ...dates }

  for (const definition of achievementDefinitions) {
    if (next[definition.id]) continue
    if (!isAchievementUnlocked(definition, snapshot)) continue

    next[definition.id] = preferredDates[definition.id] ?? fallbackDate
  }

  return next
}

export function getNewlyUnlockedAchievements(
  dates: Record<string, string>,
  snapshot: AchievementSnapshot,
): AchievementDefinition[] {
  return achievementDefinitions.filter(
    (definition) =>
      !dates[definition.id] && isAchievementUnlocked(definition, snapshot),
  )
}

export function getTodayIsoDate(): string {
  // Local calendar date, so an achievement earned after midnight is dated
  // with the player's day rather than the UTC day.
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

export function formatAchievementDate(isoDate: string): string | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return undefined

  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  )
  if (Number.isNaN(date.getTime())) return undefined

  return dateFormatter.format(date)
}

export function buildAchievementCards(
  dates: Record<string, string>,
  snapshot: AchievementSnapshot,
): Achievement[] {
  return achievementDefinitions.map((definition) => {
    const earnedIso = dates[definition.id]
    const earnedAt = earnedIso ? formatAchievementDate(earnedIso) : undefined

    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      icon: definition.icon,
      unlocked: Boolean(earnedIso),
      earnedAt,
      progress: earnedIso
        ? undefined
        : getAchievementProgress(definition, snapshot),
    }
  })
}
