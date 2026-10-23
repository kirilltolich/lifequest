import type { Achievement, CategoryId } from '../types'

export type AchievementCondition =
  | { type: 'quests-completed'; target: number }
  | { type: 'character-level'; target: number }
  | { type: 'skill-level'; target: number }
  | { type: 'total-xp'; target: number }
  | { type: 'category-quests'; category: CategoryId; target: number }

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  icon: Achievement['icon']
  condition: AchievementCondition
}

/**
 * Каталог достижений. Названия и темы прежних восьми сохранены; условия,
 * которые нельзя было отслеживать без календаря и времени, переведены на
 * реальные счётчики квестов. Новые записи закрывают недостающие типы условий
 * (50 квестов, уровень навыка, общий опыт) и не дублируют старые.
 */
export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: 'a1',
    title: 'Первый шаг',
    description: 'Выполните свой первый квест',
    icon: 'first-step',
    condition: { type: 'quests-completed', target: 1 },
  },
  {
    id: 'a2',
    title: 'На волне',
    description: 'Выполните 10 квестов',
    icon: 'streak',
    condition: { type: 'quests-completed', target: 10 },
  },
  {
    id: 'a3',
    title: 'Ранний старт',
    description: 'Выполните 5 квестов категории «Здоровье»',
    icon: 'early',
    condition: { type: 'category-quests', category: 'health', target: 5 },
  },
  {
    id: 'a4',
    title: 'Марафонец',
    description: 'Выполните 100 квестов',
    icon: 'marathon',
    condition: { type: 'quests-completed', target: 100 },
  },
  {
    id: 'a5',
    title: 'Мастер фокуса',
    description: 'Выполните 10 квестов категории «Интеллект»',
    icon: 'focus',
    condition: { type: 'category-quests', category: 'intellect', target: 10 },
  },
  {
    id: 'a6',
    title: 'Дисциплина месяца',
    description: 'Выполните 30 квестов категории «Дисциплина»',
    icon: 'month',
    condition: { type: 'category-quests', category: 'discipline', target: 30 },
  },
  {
    id: 'a7',
    title: 'Финансовый фундамент',
    description: 'Выполните 50 квестов категории «Финансы»',
    icon: 'finance',
    condition: { type: 'category-quests', category: 'finance', target: 50 },
  },
  {
    id: 'a8',
    title: 'Легенда LifeQuest',
    description: 'Достигните 20 уровня персонажа',
    icon: 'legend',
    condition: { type: 'character-level', target: 20 },
  },
  {
    id: 'a9',
    title: 'Пятьдесят шагов',
    description: 'Выполните 50 квестов',
    icon: 'marathon',
    condition: { type: 'quests-completed', target: 50 },
  },
  {
    id: 'a10',
    title: 'Мастер навыка',
    description: 'Достигните 10 уровня любого навыка',
    icon: 'legend',
    condition: { type: 'skill-level', target: 10 },
  },
  {
    id: 'a11',
    title: 'Копилка опыта',
    description: 'Заработайте 10 000 XP',
    icon: 'month',
    condition: { type: 'total-xp', target: 10_000 },
  },
]

/**
 * Демонстрационный прогресс уже полученных достижений. Даты используются
 * только при создании нового сохранения и при миграции старых, чтобы не
 * выдавать игроку уже пройденные вехи заново.
 */
export const initialAchievementDates: Record<string, string> = {
  a1: '2026-09-14',
  a2: '2026-10-05',
  a3: '2026-10-09',
  a4: '2026-10-18',
  a5: '2026-10-21',
  a9: '2026-10-12',
}
