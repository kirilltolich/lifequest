import { Home, Sparkles, Swords, Trophy, UserRound, type LucideIcon } from 'lucide-react'
import type { RouteId } from '../../hooks/useHashRoute'

export interface NavItem {
  id: RouteId
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'quests', label: 'Квесты', icon: Swords },
  { id: 'skills', label: 'Навыки', icon: Sparkles },
  { id: 'rewards', label: 'Награды', icon: Trophy },
  { id: 'profile', label: 'Профиль', icon: UserRound },
]
