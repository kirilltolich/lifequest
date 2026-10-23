import { ChevronRight, Flame } from 'lucide-react'
import type { RouteId } from '../../hooks/useHashRoute'
import type { Character } from '../../types'
import { Avatar } from '../Avatar'
import { Logo } from '../Logo'
import { navItems } from './navItems'

interface SidebarProps {
  route: RouteId
  character: Character
}

export function Sidebar({ route, character }: SidebarProps) {
  return (
    <aside className="sidebar">
      <a className="sidebar__brand" href="#/home" aria-label="LifeQuest — на главную">
        <Logo />
      </a>

      <nav className="sidebar__nav" aria-label="Основная навигация">
        <p className="sidebar__caption">Меню</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = route === item.id
          return (
            <a
              key={item.id}
              href={`#/${item.id}`}
              className={`nav-link ${isActive ? 'is-active' : ''}`.trim()}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{item.label}</span>
              {item.id === 'quests' ? <span className="nav-link__count">4</span> : null}
            </a>
          )
        })}
      </nav>

      <div className="sidebar__streak">
        <span className="sidebar__streak-icon">
          <Flame size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="sidebar__streak-value">Серия: {character.streak} дней</p>
          <p className="hint">Ещё 2 дня до личного рекорда</p>
        </div>
      </div>

      <a className="sidebar__user" href="#/profile">
        <Avatar
          themeId={character.avatarTheme}
          appearance={character.avatar}
          size="sm"
        />
        <span className="sidebar__user-text">
          <strong>{character.name}</strong>
          <span>Уровень {character.level}</span>
        </span>
        <ChevronRight size={16} aria-hidden="true" />
      </a>
    </aside>
  )
}
