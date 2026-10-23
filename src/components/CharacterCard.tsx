import { Flame, Sparkles, TrendingUp } from 'lucide-react'
import type { Character } from '../types'
import { Avatar } from './Avatar'
import { ProgressBar } from './ProgressBar'

interface CharacterCardProps {
  character: Character
  weeklyXp: number
}

export function CharacterCard({ character, weeklyXp }: CharacterCardProps) {
  const remaining = character.xpToNext - character.xp

  return (
    <section className="card character-card" aria-labelledby="character-name">
      <div className="character-card__glow" aria-hidden="true" />
      <div className="character-card__main">
        <div className="character-card__avatar-wrap">
          <Avatar
            themeId={character.avatarTheme}
            appearance={character.avatar}
            size="xl"
          />
          <span className="level-orb" title={`Уровень ${character.level}`}>
            {character.level}
          </span>
        </div>

        <div className="character-card__info">
          <p className="eyebrow">Ваш персонаж</p>
          <div className="character-card__name-row">
            <h2 id="character-name">{character.name}</h2>
            <span className="pill pill--purple">
              <Sparkles size={13} aria-hidden="true" />
              Уровень {character.level}
            </span>
          </div>
          <p className="character-card__role">{character.title}</p>
        </div>

        <div className="character-card__xp">
          <div className="character-card__xp-row">
            <span>Опыт</span>
            <span>
              <strong>{character.xp}</strong> / {character.xpToNext} XP
            </span>
          </div>
          <ProgressBar value={character.xp} max={character.xpToNext} label="Опыт персонажа" />
          <p className="hint">До {character.level + 1} уровня — {remaining} XP</p>
        </div>

        <div className="character-card__stats">
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--coral">
              <Flame size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="mini-stat__value">{character.streak} дней</p>
              <p className="mini-stat__label">Текущая серия</p>
            </div>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--mint">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="mini-stat__value">{character.questsCompleted}</p>
              <p className="mini-stat__label">Квестов выполнено</p>
            </div>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__icon mini-stat__icon--purple">
              <TrendingUp size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="mini-stat__value">{weeklyXp} XP</p>
              <p className="mini-stat__label">За эту неделю</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
