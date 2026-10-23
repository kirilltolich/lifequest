import type {
  ActivityDay,
  AvatarTheme,
  CategoryId,
  Character,
  Cosmetic,
  Quest,
  SkillTreeBranch,
  WeeklyPoint,
} from '../types'
import { defaultAvatar } from './avatarOptions'
import { getTotalSkillXpForLevel } from './skillLevels'

/** All demo data is fixed and mutually consistent for this snapshot. */
export const todayLabel = 'Четверг, 22 октября'

export const character: Character = {
  name: 'Мия',
  title: 'Исследователь привычек',
  level: 7,
  xp: 540,
  xpToNext: 900,
  streak: 12,
  questsCompleted: 128,
  totalXp: 5940,
  avatarTheme: 'lilac',
  avatar: { ...defaultAvatar },
}

export const avatarThemes: AvatarTheme[] = [
  {
    id: 'lilac',
    name: 'Лаванда',
    background: 'linear-gradient(135deg, #eae5ff 0%, #cdc3ff 100%)',
    surface: '#6f5de4',
    accent: '#a89bff',
  },
  {
    id: 'mint',
    name: 'Мята',
    background: 'linear-gradient(135deg, #e2f9f1 0%, #b9efdf 100%)',
    surface: '#218d76',
    accent: '#7ce3c8',
  },
  {
    id: 'sunset',
    name: 'Закат',
    background: 'linear-gradient(135deg, #ffede2 0%, #ffd3bd 100%)',
    surface: '#bf6340',
    accent: '#ffb28b',
  },
  {
    id: 'ocean',
    name: 'Океан',
    background: 'linear-gradient(135deg, #e4efff 0%, #c5dcff 100%)',
    surface: '#3a69b3',
    accent: '#8db9f6',
  },
]

export const initialQuests: Quest[] = [
  {
    id: 'q1',
    title: 'Утренняя зарядка',
    description: '15 минут растяжки и лёгкой кардиотренировки',
    category: 'health',
    difficulty: 'easy',
    xp: 40,
    completed: true,
    rewarded: true,
    scheduledFor: '07:30',
    isToday: true,
  },
  {
    id: 'q2',
    title: 'Прочитать главу книги',
    description: '«Думай медленно… решай быстро», глава 4',
    category: 'intellect',
    difficulty: 'medium',
    xp: 60,
    completed: true,
    rewarded: true,
    scheduledFor: '12:00',
    isToday: true,
  },
  {
    id: 'q3',
    title: 'Подготовить план спринта',
    description: 'Собрать задачи команды и расставить приоритеты',
    category: 'career',
    difficulty: 'hard',
    xp: 90,
    completed: false,
    rewarded: false,
    scheduledFor: '15:00',
    isToday: true,
  },
  {
    id: 'q4',
    title: 'Отложить 10% дохода',
    description: 'Перевести сумму на накопительный счёт',
    category: 'finance',
    difficulty: 'medium',
    xp: 50,
    completed: false,
    rewarded: false,
    scheduledFor: '20:00',
    isToday: true,
  },
  {
    id: 'q5',
    title: 'Прогулка 8 000 шагов',
    description: 'Без наушников — просто наблюдайте за городом',
    category: 'health',
    difficulty: 'easy',
    xp: 30,
    completed: false,
    rewarded: false,
    scheduledFor: '18:30',
    isToday: false,
  },
  {
    id: 'q6',
    title: 'Разобрать входящие до нуля',
    description: 'Ответить, архивировать или запланировать',
    category: 'discipline',
    difficulty: 'medium',
    xp: 55,
    completed: false,
    rewarded: false,
    scheduledFor: '17:00',
    isToday: false,
  },
  {
    id: 'q7',
    title: 'Урок по TypeScript',
    description: 'Типы-утилиты и работа с дженериками',
    category: 'intellect',
    difficulty: 'hard',
    xp: 85,
    completed: false,
    rewarded: false,
    scheduledFor: '21:00',
    isToday: false,
  },
  {
    id: 'q8',
    title: 'Пересмотреть бюджет месяца',
    description: 'Сверить категории расходов и отложенное',
    category: 'finance',
    difficulty: 'medium',
    xp: 60,
    completed: false,
    rewarded: false,
    scheduledFor: '19:00',
    isToday: false,
  },
  {
    id: 'q9',
    title: 'Вечерний обзор дня',
    description: 'Три вопроса: что получилось, что нет, что дальше',
    category: 'discipline',
    difficulty: 'easy',
    xp: 25,
    completed: false,
    rewarded: false,
    scheduledFor: '22:30',
    isToday: false,
  },
]

/**
 * Начальный прогресс навыков. Уровни и текущий опыт совпадают с прежними
 * демо-данными, но хранится общее (кумулятивное) значение по шкале навыков.
 */
const initialSkills: Array<{ id: CategoryId; level: number; xp: number }> = [
  { id: 'health', level: 6, xp: 640 },
  { id: 'intellect', level: 7, xp: 720 },
  { id: 'career', level: 5, xp: 380 },
  { id: 'finance', level: 4, xp: 260 },
  { id: 'discipline', level: 8, xp: 810 },
]

export const initialSkillXp = Object.fromEntries(
  initialSkills.map((skill) => [
    skill.id,
    getTotalSkillXpForLevel(skill.level) + skill.xp,
  ]),
) as Record<CategoryId, number>

/** Historical rewarded quests per category; the sum matches 128 demo quests. */
export const initialCategoryQuests: Record<CategoryId, number> = {
  health: 34,
  intellect: 27,
  career: 18,
  finance: 38,
  discipline: 11,
}

/** Initial demo balance; later quests and purchases change the saved value. */
export const coinBalance = 1240

/** Two starting looks are already owned; the other two are shop offers. */
export const initialOwnedCosmetics = ['c1', 'c2']

export const cosmetics: Cosmetic[] = [
  { id: 'c1', name: 'Лавандовая аура', price: 0, theme: 'lilac' },
  { id: 'c2', name: 'Мятный рассвет', price: 0, theme: 'mint' },
  { id: 'c3', name: 'Тёплый закат', price: 900, theme: 'sunset' },
  { id: 'c4', name: 'Глубокий океан', price: 1200, theme: 'ocean' },
]

const activityLevels: Array<0 | 1 | 2 | 3> = [
  1, 0, 2, 0, 1, 1, 0,
  2, 1, 0, 1, 0, 2, 1,
  0, 1, 2, 3, 1, 2, 1,
  2, 3, 1, 2, 2, 3, 2,
  3, 1, 2, 3, 0, 0, 0,
]

const calendarStart = Date.UTC(2026, 8, 21) // Monday, Sep 21 2026
const todayIso = '2026-10-22'
const dayMs = 24 * 60 * 60 * 1000

export const activityDays: ActivityDay[] = activityLevels.map((level, index) => {
  const date = new Date(calendarStart + index * dayMs)
  const isoDate = date.toISOString().slice(0, 10)
  return {
    isoDate,
    level,
    isToday: isoDate === todayIso,
    isFuture: isoDate > todayIso,
  }
})

export const activityDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const weeklyProgress: WeeklyPoint[] = [
  { label: 'Пн', value: 70 },
  { label: 'Вт', value: 110 },
  { label: 'Ср', value: 45 },
  { label: 'Чт', value: 130, isToday: true },
  { label: 'Пт', value: 0, isFuture: true },
  { label: 'Сб', value: 0, isFuture: true },
  { label: 'Вс', value: 0, isFuture: true },
]

export const weeklyXp = weeklyProgress.reduce((sum, day) => sum + day.value, 0)
export const weeklyGoal = 400

export const skillTree: SkillTreeBranch[] = [
  {
    id: 'health',
    label: 'Здоровье',
    nodes: [
      { id: 'h1', title: 'Ранний подъём', subtitle: 'Открыто · 19 дней', status: 'open', icon: 'sun' },
      { id: 'h2', title: 'Осознанное питание', subtitle: 'Нужен 7 ур. навыка', status: 'locked', icon: 'moon' },
    ],
  },
  {
    id: 'intellect',
    label: 'Интеллект',
    nodes: [
      { id: 'i1', title: 'Глубокий фокус', subtitle: 'Открыто · 4 сессии', status: 'open', icon: 'focus' },
      { id: 'i2', title: 'Скорочтение', subtitle: 'Нужен 9 ур. навыка', status: 'locked', icon: 'book' },
    ],
  },
  {
    id: 'finance',
    label: 'Финансы',
    nodes: [
      { id: 'f1', title: 'Подушка безопасности', subtitle: 'Открыто · 62%', status: 'open', icon: 'shield' },
      { id: 'f2', title: 'Портфель новичка', subtitle: 'Нужен 6 ур. навыка', status: 'locked', icon: 'chart' },
    ],
  },
]
