import {
  avatarThemes,
  character,
  coinBalance,
  cosmetics,
  initialCategoryQuests,
  initialOwnedCosmetics,
  initialQuests,
  initialSkillXp,
} from '../data/demoData'
import {
  achievementDefinitions,
  initialAchievementDates,
} from '../data/achievements'
import { defaultAvatar } from '../data/avatarOptions'
import { sanitizeAvatarConfig } from './avatar'
import {
  getAchievementSnapshot,
  reconcileAchievementDates,
} from './achievements'
import type {
  AvatarThemeId,
  CategoryId,
  Difficulty,
  GameState,
  Quest,
} from '../types'

export const STORAGE_KEY = 'lifequest.game.v1'
// Version 5 added the character-builder appearance. The key is unchanged so
// version 1–4 saves can migrate in place.
const STORAGE_VERSION = 5
const LEGACY_STORAGE_VERSIONS = [1, 2, 3, 4]
const MAX_NAME_LENGTH = 20
const MAX_SKILL_XP = 10_000_000
const MAX_CATEGORY_QUESTS = 1_000_000
const MAX_COINS = 1_000_000_000
const knownAchievementIds = new Set(
  achievementDefinitions.map((achievement) => achievement.id),
)
const initialRewardedQuestIds = new Set(
  initialQuests.filter((quest) => quest.rewarded).map((quest) => quest.id),
)

const validCategories: CategoryId[] = [
  'health',
  'intellect',
  'career',
  'finance',
  'discipline',
]
const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard']
const validThemes = avatarThemes.map((theme) => theme.id)
const validCosmeticIds = new Set(cosmetics.map((item) => item.id))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCategory(value: unknown): value is CategoryId {
  return typeof value === 'string' && validCategories.includes(value as CategoryId)
}

function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && validDifficulties.includes(value as Difficulty)
}

function isAvatarTheme(value: unknown): value is AvatarThemeId {
  return typeof value === 'string' && validThemes.includes(value as AvatarThemeId)
}

function readNonNegativeInt(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback
}

function readCoinAmount(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.min(Math.floor(value), MAX_COINS)
    : fallback
}

function readCoinTotals(
  value: Record<string, unknown>,
  fallbackCoins: number,
): Pick<GameState, 'coins' | 'coinsEarned' | 'coinsSpent'> {
  const coins = readCoinAmount(value.coins, fallbackCoins)
  const coinsSpent = readCoinAmount(value.coinsSpent, 0)
  // Old saves have no lifetime totals. Starting from the current balance
  // avoids inventing rewards, and the lower bound keeps the three values
  // consistent.
  const coinsEarned = Math.max(
    readCoinAmount(value.coinsEarned, coins + coinsSpent),
    coins + coinsSpent,
  )

  return { coins, coinsEarned, coinsSpent }
}

function readOwnedCosmetics(value: unknown, avatarTheme: AvatarThemeId): string[] {
  const owned = new Set<string>(initialOwnedCosmetics)

  if (Array.isArray(value)) {
    for (const id of value) {
      if (typeof id === 'string' && validCosmeticIds.has(id)) owned.add(id)
    }
  }

  // Previous versions allowed every avatar theme from the profile. Keep the
  // selected look usable after migration instead of silently replacing it.
  const selected = cosmetics.find((item) => item.theme === avatarTheme)
  if (selected) owned.add(selected.id)

  return [...owned]
}

function readName(value: unknown): string {
  if (typeof value !== 'string') return character.name
  const trimmed = value.trim().slice(0, MAX_NAME_LENGTH)
  return trimmed.length > 0 ? trimmed : character.name
}

function readQuest(value: unknown): Quest | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'string' || value.id.length === 0) return null
  if (!isCategory(value.category) || !isDifficulty(value.difficulty)) return null
  if (typeof value.title !== 'string' || value.title.trim().length === 0) return null

  const completed = value.completed === true
  const scheduledFor =
    typeof value.scheduledFor === 'string' && /^\d{2}:\d{2}$/.test(value.scheduledFor)
      ? value.scheduledFor
      : '18:00'

  return {
    id: value.id,
    title: value.title.trim().slice(0, 120),
    description:
      typeof value.description === 'string' ? value.description.slice(0, 500) : '',
    category: value.category,
    difficulty: value.difficulty,
    xp: Math.min(readNonNegativeInt(value.xp, 0), 10_000),
    completed,
    // A completed quest from an older record must never award XP again.
    rewarded: value.rewarded === true || completed,
    scheduledFor,
    isToday: value.isToday === true,
  }
}

function readSkillXp(value: unknown): Record<CategoryId, number> {
  const source = isRecord(value) ? value : {}
  const result = {} as Record<CategoryId, number>

  for (const category of validCategories) {
    const raw = source[category]
    result[category] =
      typeof raw === 'number' && Number.isFinite(raw) && raw >= 0
        ? Math.min(Math.floor(raw), MAX_SKILL_XP)
        : initialSkillXp[category]
  }

  return result
}

function readCategoryQuests(
  value: unknown,
  quests: Quest[],
): Record<CategoryId, number> {
  if (isRecord(value)) {
    const hasEveryCategory = validCategories.every((category) => {
      const raw = value[category]
      return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0
    })

    if (hasEveryCategory) {
      const saved = {} as Record<CategoryId, number>
      for (const category of validCategories) {
        saved[category] = Math.min(
          Math.floor(value[category] as number),
          MAX_CATEGORY_QUESTS,
        )
      }
      return saved
    }
  }

  // Older saves have no per-category counters. Start from the demo baseline
  // and restore completions that happened after that snapshot.
  const migrated = { ...initialCategoryQuests }
  for (const quest of quests) {
    if (!quest.rewarded || initialRewardedQuestIds.has(quest.id)) continue
    migrated[quest.category] += 1
  }
  return migrated
}

function readAchievementDates(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}

  const dates: Record<string, string> = {}
  for (const [id, date] of Object.entries(value)) {
    if (!knownAchievementIds.has(id) || typeof date !== 'string') continue
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue
    if (Number.isNaN(Date.parse(date))) continue
    dates[id] = date
  }
  return dates
}

function readQuests(value: unknown): Quest[] {
  if (!Array.isArray(value)) return initialQuests.map((quest) => ({ ...quest }))

  const seen = new Set<string>()
  const quests = value
    .map(readQuest)
    .filter((quest): quest is Quest => {
      if (!quest || seen.has(quest.id)) return false
      seen.add(quest.id)
      return true
    })

  // A non-empty array that lost every record is treated as corrupted input.
  if (value.length > 0 && quests.length === 0) {
    return initialQuests.map((quest) => ({ ...quest }))
  }

  return quests
}

export function createInitialGameState(): GameState {
  return {
    name: character.name,
    avatarTheme: character.avatarTheme,
    totalXp: character.totalXp,
    questsCompleted: character.questsCompleted,
    quests: initialQuests.map((quest) => ({ ...quest })),
    avatar: { ...defaultAvatar },
    skillXp: { ...initialSkillXp },
    categoryQuests: { ...initialCategoryQuests },
    achievements: { ...initialAchievementDates },
    coins: coinBalance,
    coinsEarned: coinBalance,
    coinsSpent: 0,
    ownedCosmetics: [...initialOwnedCosmetics],
  }
}

/**
 * Loads the saved game. Any parsing problem, unsupported version or invalid
 * field falls back to safe initial data instead of preventing the app from
 * starting.
 */
export function loadGameState(): GameState {
  const initial = createInitialGameState()
  if (typeof window === 'undefined') return initial

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initial

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return initial

    const version = parsed.version
    const isSupported =
      version === STORAGE_VERSION || LEGACY_STORAGE_VERSIONS.includes(Number(version))
    if (!isSupported) return initial

    const quests = readQuests(parsed.quests)
    const avatarTheme = isAvatarTheme(parsed.avatarTheme)
      ? parsed.avatarTheme
      : initial.avatarTheme
    const game = {
      name: readName(parsed.name),
      avatarTheme,
      totalXp: readNonNegativeInt(parsed.totalXp, initial.totalXp),
      questsCompleted: readNonNegativeInt(parsed.questsCompleted, initial.questsCompleted),
      quests,
      avatar: sanitizeAvatarConfig(parsed.avatar),
      // Version 1 saves have no skillXp: keep their character progress and
      // start skills from the demo baseline instead of failing to load.
      skillXp: readSkillXp(parsed.skillXp),
      categoryQuests: readCategoryQuests(parsed.categoryQuests, quests),
      ...readCoinTotals(parsed, initial.coins),
      ownedCosmetics: readOwnedCosmetics(parsed.ownedCosmetics, avatarTheme),
    }

    // Old saves have no achievement dates. Recognize conditions that are
    // already met, using the original demo dates where available, without
    // touching XP or completed quest counters.
    const achievements = reconcileAchievementDates(
      readAchievementDates(parsed.achievements),
      getAchievementSnapshot(game),
    )

    return { ...game, achievements }
  } catch {
    return initial
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, ...state }),
    )
  } catch {
    // Quota or privacy-mode errors must not break the interface.
  }
}
