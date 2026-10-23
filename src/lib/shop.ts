import { avatarThemes, cosmetics } from '../data/demoData'
import type {
  AvatarTheme,
  Cosmetic,
  CosmeticItem,
  CosmeticStatus,
  Difficulty,
  GameState,
} from '../types'

/**
 * Coin rewards for the existing difficulty levels. There is no "epic"
 * difficulty in the quest model yet, so no separate entry is invented.
 */
export const questCoinRewards: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
}

export function getQuestCoinReward(difficulty: Difficulty): number {
  return questCoinRewards[difficulty] ?? 0
}

function findCosmetic(id: string): Cosmetic | undefined {
  return cosmetics.find((item) => item.id === id)
}

export function isCosmeticOwned(
  state: Pick<GameState, 'ownedCosmetics'>,
  id: string,
): boolean {
  return state.ownedCosmetics.includes(id)
}

export function getCosmeticStatus(
  state: Pick<GameState, 'ownedCosmetics' | 'avatarTheme'>,
  item: Cosmetic,
): CosmeticStatus {
  if (!state.ownedCosmetics.includes(item.id)) return 'available'
  return state.avatarTheme === item.theme ? 'equipped' : 'owned'
}

export function getCosmeticItems(
  state: Pick<GameState, 'ownedCosmetics' | 'avatarTheme'>,
): CosmeticItem[] {
  return cosmetics.map((item) => ({
    ...item,
    status: getCosmeticStatus(state, item),
  }))
}

/** Avatar styles are the cosmetics; accessories are not part of the model yet. */
export function getOwnedAvatarThemes(
  state: Pick<GameState, 'ownedCosmetics'>,
): AvatarTheme[] {
  const owned = new Set(state.ownedCosmetics)
  return avatarThemes.filter((theme) => {
    const item = cosmetics.find((cosmetic) => cosmetic.theme === theme.id)
    return item ? owned.has(item.id) : false
  })
}

export function getCosmeticByTheme(themeId: AvatarTheme['id']): Cosmetic | undefined {
  return cosmetics.find((item) => item.theme === themeId)
}

export type BuyCosmeticOutcome =
  | 'bought'
  | 'already-owned'
  | 'insufficient-funds'
  | 'not-found'

export interface BuyCosmeticResult {
  state: GameState
  outcome: BuyCosmeticOutcome
  item?: Cosmetic
}

/**
 * Purchases are validated against both ownership and balance before any state
 * is changed. The returned state is always a new object on success.
 */
export function buyCosmetic(state: GameState, id: string): BuyCosmeticResult {
  const item = findCosmetic(id)
  if (!item) return { state, outcome: 'not-found' }

  if (isCosmeticOwned(state, id)) {
    return { state, outcome: 'already-owned', item }
  }

  if (state.coins < item.price) {
    return { state, outcome: 'insufficient-funds', item }
  }

  const nextCoins = Math.max(0, state.coins - item.price)
  return {
    state: {
      ...state,
      coins: nextCoins,
      coinsSpent: state.coinsSpent + item.price,
      ownedCosmetics: [...state.ownedCosmetics, item.id],
    },
    outcome: 'bought',
    item,
  }
}

export type EquipCosmeticOutcome =
  | 'equipped'
  | 'already-equipped'
  | 'not-owned'
  | 'not-found'

export interface EquipCosmeticResult {
  state: GameState
  outcome: EquipCosmeticOutcome
  item?: Cosmetic
}

/** Equipping only changes the selected avatar theme; coins are untouched. */
export function equipCosmetic(state: GameState, id: string): EquipCosmeticResult {
  const item = findCosmetic(id)
  if (!item) return { state, outcome: 'not-found' }

  if (!isCosmeticOwned(state, id)) {
    return { state, outcome: 'not-owned', item }
  }

  if (state.avatarTheme === item.theme) {
    return { state, outcome: 'already-equipped', item }
  }

  return {
    state: { ...state, avatarTheme: item.theme },
    outcome: 'equipped',
    item,
  }
}
