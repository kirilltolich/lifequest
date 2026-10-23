import { Coins, Flame } from 'lucide-react'
import { todayLabel } from '../../data/demoData'
import type { Character } from '../../types'
import { Avatar } from '../Avatar'
import { Logo } from '../Logo'

interface TopBarProps {
  character: Character
  coins: number
}

const numberFormatter = new Intl.NumberFormat('ru-RU')

export function TopBar({ character, coins }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <a className="topbar__brand" href="#/home" aria-label="LifeQuest — на главную">
          <Logo />
        </a>
        <span className="topbar__date">{todayLabel}</span>
      </div>

      <div className="topbar__right">
        <a className="pill pill--coral topbar__pill" href="#/profile">
          <Flame size={14} aria-hidden="true" />
          {character.streak} дней
        </a>
        <a className="pill pill--amber topbar__pill" href="#/rewards">
          <Coins size={14} aria-hidden="true" />
          {numberFormatter.format(coins)}
        </a>
        <a
          className="topbar__avatar"
          href="#/profile"
          aria-label={`Профиль: ${character.name}, уровень ${character.level}`}
        >
          <Avatar
            themeId={character.avatarTheme}
            appearance={character.avatar}
            size="sm"
          />
        </a>
      </div>
    </header>
  )
}
