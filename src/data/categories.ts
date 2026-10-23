import {
  Brain,
  Briefcase,
  Flame,
  HeartPulse,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryId, Difficulty } from '../types'

export type CategoryTint = 'purple' | 'mint' | 'sky' | 'amber' | 'coral'

interface CategoryMeta {
  id: CategoryId
  label: string
  icon: LucideIcon
  tint: CategoryTint
}

export const categories: CategoryMeta[] = [
  { id: 'health', label: 'Здоровье', icon: HeartPulse, tint: 'mint' },
  { id: 'intellect', label: 'Интеллект', icon: Brain, tint: 'purple' },
  { id: 'career', label: 'Карьера', icon: Briefcase, tint: 'sky' },
  { id: 'finance', label: 'Финансы', icon: Wallet, tint: 'amber' },
  { id: 'discipline', label: 'Дисциплина', icon: Flame, tint: 'coral' },
]

export const categoryMap = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, CategoryMeta>

export const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
}

export const difficultyXp: Record<Difficulty, string> = {
  easy: '25–40 XP',
  medium: '50–70 XP',
  hard: '85–100 XP',
}
