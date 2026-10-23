export type CategoryId = 'health' | 'intellect' | 'career' | 'finance' | 'discipline'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type AvatarThemeId = 'lilac' | 'mint' | 'sunset' | 'ocean'

export type SkinToneId = 'porcelain' | 'light' | 'warm' | 'tan' | 'brown' | 'deep'
export type HairStyleId = 'short' | 'bob' | 'long' | 'curly' | 'bun'
export type HairColorId =
  | 'ink'
  | 'chestnut'
  | 'copper'
  | 'honey'
  | 'platinum'
  | 'violet'
export type EyeColorId = 'brown' | 'hazel' | 'green' | 'blue' | 'gray' | 'violet'
export type BrowShapeId = 'soft' | 'straight' | 'arched'
export type OutfitStyleId = 'tee' | 'hoodie' | 'jacket'
export type OutfitColorId =
  | 'lavender'
  | 'mint'
  | 'sunset'
  | 'ocean'
  | 'charcoal'
  | 'cream'
export type AvatarAccessoryId = 'none' | 'glasses' | 'earrings'

export interface AvatarConfig {
  skinTone: SkinToneId
  hairStyle: HairStyleId
  hairColor: HairColorId
  eyeColor: EyeColorId
  browShape: BrowShapeId
  outfitStyle: OutfitStyleId
  outfitColor: OutfitColorId
  accessory: AvatarAccessoryId
}

export interface AvatarOption<T extends string = string> {
  id: T
  label: string
  color?: string
  /** Reserved for future shop unlocks of individual avatar options. */
  unlockId?: string
}

export interface Category {
  id: CategoryId
  label: string
}

export interface Quest {
  id: string
  title: string
  description: string
  category: CategoryId
  difficulty: Difficulty
  xp: number
  completed: boolean
  /** XP is granted only on the first completion of a quest. */
  rewarded: boolean
  scheduledFor: string
  isToday: boolean
}

export interface GameState {
  name: string
  avatarTheme: AvatarThemeId
  totalXp: number
  questsCompleted: number
  quests: Quest[]
  /** Reusable character-builder settings; themeId remains the background. */
  avatar: AvatarConfig
  /** Cumulative XP earned by each skill; levels are derived from it. */
  skillXp: Record<CategoryId, number>
  /** How many rewarded quests were completed in each category. */
  categoryQuests: Record<CategoryId, number>
  /** Achievement id -> ISO date when it was earned. */
  achievements: Record<string, string>
  /** Current coin balance. Never negative. */
  coins: number
  /** Lifetime coins earned from quests and initial data. */
  coinsEarned: number
  /** Lifetime coins spent in the cosmetics shop. */
  coinsSpent: number
  /** Cosmetic item ids owned by the player. */
  ownedCosmetics: string[]
}

export interface Skill {
  id: CategoryId
  level: number
  xp: number
  xpToNext: number
  totalXp: number
}

export interface Character {
  name: string
  title: string
  level: number
  xp: number
  xpToNext: number
  streak: number
  questsCompleted: number
  totalXp: number
  avatarTheme: AvatarThemeId
  avatar: AvatarConfig
}

export interface AvatarTheme {
  id: AvatarThemeId
  name: string
  background: string
  surface: string
  accent: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: 'first-step' | 'streak' | 'month' | 'marathon' | 'focus' | 'finance' | 'early' | 'legend'
  unlocked: boolean
  earnedAt?: string
  progress?: { current: number; total: number }
}

export interface Cosmetic {
  id: string
  name: string
  price: number
  theme: AvatarThemeId
}

export type CosmeticStatus = 'available' | 'owned' | 'equipped'

export interface CosmeticItem extends Cosmetic {
  status: CosmeticStatus
}

export interface ActivityDay {
  isoDate: string
  level: 0 | 1 | 2 | 3
  isToday?: boolean
  isFuture?: boolean
}

export interface WeeklyPoint {
  label: string
  value: number
  isToday?: boolean
  isFuture?: boolean
}

export type SkillTreeNodeStatus = 'open' | 'locked'

export interface SkillTreeNode {
  id: string
  title: string
  subtitle: string
  status: SkillTreeNodeStatus
  icon: 'sun' | 'moon' | 'focus' | 'book' | 'shield' | 'chart'
}

export interface SkillTreeBranch {
  id: CategoryId
  label: string
  nodes: SkillTreeNode[]
}
