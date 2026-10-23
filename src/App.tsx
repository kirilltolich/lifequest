import { CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AvatarBuilder } from './components/AvatarBuilder'
import { MobileNav } from './components/navigation/MobileNav'
import { Sidebar } from './components/navigation/Sidebar'
import { TopBar } from './components/navigation/TopBar'
import type { NewQuestInput } from './components/QuestFormModal'
import { categories, categoryMap } from './data/categories'
import { character as demoCharacter, weeklyXp as baseWeeklyXp } from './data/demoData'
import { getLevelProgress } from './data/levels'
import { getSkillProgress } from './data/skillLevels'
import { useHashRoute, type RouteId } from './hooks/useHashRoute'
import {
  buildAchievementCards,
  getAchievementSnapshot,
  getNewlyUnlockedAchievements,
  getTodayIsoDate,
} from './lib/achievements'
import {
  buyCosmetic,
  equipCosmetic,
  getCosmeticByTheme,
  getCosmeticItems,
  getOwnedAvatarThemes,
  getQuestCoinReward,
} from './lib/shop'
import { loadGameState, saveGameState } from './lib/storage'
import { HomeScreen } from './screens/HomeScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { QuestsScreen } from './screens/QuestsScreen'
import { RewardsScreen } from './screens/RewardsScreen'
import { SkillsScreen } from './screens/SkillsScreen'
import type {
  AvatarConfig,
  AvatarThemeId,
  Character,
  GameState,
  Quest,
  Skill,
} from './types'

const pageTitles: Record<RouteId, string> = {
  home: 'Главная',
  quests: 'Квесты',
  skills: 'Навыки',
  rewards: 'Награды',
  profile: 'Профиль',
}

interface Toast {
  id: number
  message: string
}

function achievementSuffix(items: Array<{ title: string }>): string {
  if (items.length === 0) return ''
  if (items.length === 1) return ` Достижение «${items[0].title}» получено!`
  return ` Новые достижения: ${items.map((item) => `«${item.title}»`).join(', ')}.`
}

export default function App() {
  const route = useHashRoute()
  const [game, setGame] = useState<GameState>(loadGameState)
  const [toast, setToast] = useState<Toast | null>(null)
  const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false)

  const levelProgress = getLevelProgress(game.totalXp)
  const character: Character = {
    ...demoCharacter,
    name: game.name,
    avatarTheme: game.avatarTheme,
    avatar: game.avatar,
    level: levelProgress.level,
    xp: levelProgress.xp,
    xpToNext: levelProgress.xpToNext,
    totalXp: levelProgress.totalXp,
    questsCompleted: game.questsCompleted,
  }
  // Skill levels are derived from cumulative XP on a separate scale.
  const skills: Skill[] = categories.map((category) => ({
    id: category.id,
    ...getSkillProgress(game.skillXp[category.id]),
  }))
  const achievements = buildAchievementCards(
    game.achievements,
    getAchievementSnapshot(game),
  )
  const cosmeticItems = getCosmeticItems(game)
  const ownedThemes = getOwnedAvatarThemes(game)
  // XP earned after the demo snapshot is added to this week's demo chart.
  const earnedXp = Math.max(0, game.totalXp - demoCharacter.totalXp)
  const weeklyXp = baseWeeklyXp + earnedXp

  useEffect(() => {
    document.title = `${pageTitles[route]} — LifeQuest`
  }, [route])

  useEffect(() => {
    saveGameState(game)
  }, [game])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 3400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const notify = (message: string) => {
    setToast({ id: Date.now(), message })
  }

  const handleToggleQuest = (id: string) => {
    const quest = game.quests.find((item) => item.id === id)
    if (!quest) return

    const willComplete = !quest.completed
    // The rewarded flag guards XP, coins and all progress counters together.
    const grantsReward = willComplete && !quest.rewarded
    const coinReward = grantsReward ? getQuestCoinReward(quest.difficulty) : 0
    const nextTotalXp = grantsReward ? game.totalXp + quest.xp : game.totalXp
    const currentLevel = getLevelProgress(game.totalXp).level
    const nextLevel = getLevelProgress(nextTotalXp).level
    const skillBefore = getSkillProgress(game.skillXp[quest.category])
    const nextSkillXp = grantsReward
      ? game.skillXp[quest.category] + quest.xp
      : game.skillXp[quest.category]
    const skillAfter = getSkillProgress(nextSkillXp)
    const skillLabel = categoryMap[quest.category].label
    const nextGame: GameState = {
      ...game,
      totalXp: nextTotalXp,
      coins: grantsReward ? game.coins + coinReward : game.coins,
      coinsEarned: grantsReward ? game.coinsEarned + coinReward : game.coinsEarned,
      questsCompleted: grantsReward ? game.questsCompleted + 1 : game.questsCompleted,
      skillXp: grantsReward
        ? { ...game.skillXp, [quest.category]: nextSkillXp }
        : game.skillXp,
      categoryQuests: grantsReward
        ? {
            ...game.categoryQuests,
            [quest.category]: (game.categoryQuests[quest.category] ?? 0) + 1,
          }
        : game.categoryQuests,
      quests: game.quests.map((item) =>
        item.id === id
          ? { ...item, completed: willComplete, rewarded: item.rewarded || grantsReward }
          : item,
      ),
    }

    const newlyUnlocked = grantsReward
      ? getNewlyUnlockedAchievements(
          game.achievements,
          getAchievementSnapshot(nextGame),
        )
      : []
    const nextAchievements =
      newlyUnlocked.length > 0
        ? {
            ...game.achievements,
            ...Object.fromEntries(
              newlyUnlocked.map((achievement) => [
                achievement.id,
                getTodayIsoDate(),
              ]),
            ),
          }
        : game.achievements

    setGame({ ...nextGame, achievements: nextAchievements })
    const newAchievementsMessage = achievementSuffix(newlyUnlocked)

    if (!willComplete) {
      notify(`«${quest.title}» возвращён в работу. Полученные опыт и монеты сохраняются.`)
      return
    }

    if (!grantsReward) {
      notify(
        `«${quest.title}» уже приносил опыт и монеты — повторно награда не начисляется.`,
      )
      return
    }

    if (nextLevel > currentLevel) {
      notify(
        `Новый уровень — ${nextLevel}! «${quest.title}» принёс +${quest.xp} XP и ` +
          `+${coinReward} монет. Навык «${skillLabel}»: +${quest.xp} XP.` +
          newAchievementsMessage,
      )
      return
    }

    notify(
      (skillAfter.level > skillBefore.level
        ? `«${quest.title}» выполнено! +${quest.xp} XP и +${coinReward} монет. ` +
          `Навык «${skillLabel}» вырос до уровня ${skillAfter.level}.`
        : `«${quest.title}» выполнено! +${quest.xp} XP и +${coinReward} монет. ` +
          `Навык «${skillLabel}»: +${quest.xp} XP.`) + newAchievementsMessage,
    )
  }

  const handleCreateQuest = (input: NewQuestInput) => {
    const newQuest: Quest = {
      ...input,
      id: `custom-${Date.now()}`,
      completed: false,
      rewarded: false,
      isToday: false,
    }
    setGame((current) => ({ ...current, quests: [newQuest, ...current.quests] }))
  }

  const handleBuyCosmetic = (id: string) => {
    const result = buyCosmetic(game, id)

    if (result.outcome === 'bought' && result.item) {
      setGame(result.state)
      notify(
        `«${result.item.name}» куплено за ${result.item.price} монет. ` +
          `Осталось ${result.state.coins}.`,
      )
      return
    }

    if (result.outcome === 'already-owned' && result.item) {
      notify(`«${result.item.name}» уже есть в коллекции.`)
      return
    }

    if (result.outcome === 'insufficient-funds' && result.item) {
      notify(
        `Недостаточно монет для «${result.item.name}»: нужно ещё ` +
          `${result.item.price - game.coins} монет.`,
      )
      return
    }

    notify('Косметический предмет не найден.')
  }

  const handleEquipCosmetic = (id: string) => {
    const result = equipCosmetic(game, id)

    if (result.outcome === 'equipped' && result.item) {
      setGame(result.state)
      notify(`Стиль «${result.item.name}» надет.`)
      return
    }

    if (result.outcome === 'already-equipped' && result.item) {
      notify(`Стиль «${result.item.name}» уже надет.`)
      return
    }

    if (result.outcome === 'not-owned' && result.item) {
      notify(`Сначала купите «${result.item.name}» в магазине.`)
      return
    }

    notify('Косметический предмет не найден.')
  }

  const handleUpdateName = (name: string) => {
    setGame((current) => ({ ...current, name }))
  }

  const handleUpdateAvatarTheme = (avatarTheme: AvatarThemeId) => {
    const cosmetic = getCosmeticByTheme(avatarTheme)
    if (!cosmetic) {
      notify('Такой стиль аватара не найден.')
      return
    }
    handleEquipCosmetic(cosmetic.id)
  }

  const handleUpdateAvatar = (avatar: AvatarConfig) => {
    setGame((current) => ({ ...current, avatar }))
    notify('Внешность персонажа сохранена.')
  }

  return (
    <div className="app">
      <Sidebar route={route} character={character} />

      <div className="app__main">
        <TopBar character={character} coins={game.coins} />

        <main className="app__content">
          <div className="route" key={route}>
            {route === 'home' ? (
              <HomeScreen
                character={character}
                quests={game.quests}
                weeklyXp={weeklyXp}
                onToggleQuest={handleToggleQuest}
              />
            ) : null}
            {route === 'quests' ? (
              <QuestsScreen
                quests={game.quests}
                onToggleQuest={handleToggleQuest}
                onCreateQuest={handleCreateQuest}
                notify={notify}
              />
            ) : null}
            {route === 'skills' ? <SkillsScreen skills={skills} /> : null}
            {route === 'rewards' ? (
              <RewardsScreen
                achievements={achievements}
                coins={game.coins}
                coinsEarned={game.coinsEarned}
                coinsSpent={game.coinsSpent}
                cosmetics={cosmeticItems}
                avatar={game.avatar}
                onBuyCosmetic={handleBuyCosmetic}
                onEquipCosmetic={handleEquipCosmetic}
                notify={notify}
              />
            ) : null}
            {route === 'profile' ? (
              <ProfileScreen
                character={character}
                skills={skills}
                achievements={achievements}
                ownedThemes={ownedThemes}
                bonusWeeklyXp={earnedXp}
                onUpdateName={handleUpdateName}
                onUpdateAvatarTheme={handleUpdateAvatarTheme}
                onOpenAvatarBuilder={() => setIsAvatarBuilderOpen(true)}
                notify={notify}
              />
            ) : null}
          </div>
        </main>
      </div>

      <MobileNav route={route} />

      <AvatarBuilder
        key={isAvatarBuilderOpen ? 'avatar-open' : 'avatar-closed'}
        open={isAvatarBuilderOpen}
        avatar={game.avatar}
        themeId={game.avatarTheme}
        onClose={() => setIsAvatarBuilderOpen(false)}
        onSave={handleUpdateAvatar}
      />

      <div className="toast-region" role="status" aria-live="polite">
        {toast ? (
          <div className="toast" key={toast.id}>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{toast.message}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
