import { Check, Clock } from 'lucide-react'
import { categoryMap, difficultyLabels } from '../data/categories'
import type { Quest } from '../types'

interface QuestCardProps {
  quest: Quest
  variant?: 'compact' | 'full'
  onToggle: (id: string) => void
}

export function QuestCard({ quest, variant = 'full', onToggle }: QuestCardProps) {
  const category = categoryMap[quest.category]
  const CategoryIcon = category.icon

  return (
    <article
      className={`card quest-card quest-card--${variant} ${quest.completed ? 'is-done' : ''}`.trim()}
    >
      <button
        type="button"
        className="quest-card__check"
        onClick={() => onToggle(quest.id)}
        aria-pressed={quest.completed}
        aria-label={
          quest.completed ? `Отменить выполнение: ${quest.title}` : `Выполнить: ${quest.title}`
        }
      >
        <Check size={15} strokeWidth={3} aria-hidden="true" />
      </button>

      <div className="quest-card__body">
        <div className="quest-card__top">
          <span className={`category-chip category-chip--${category.tint}`}>
            <CategoryIcon size={13} aria-hidden="true" />
            {category.label}
          </span>
          <span className="quest-card__time">
            <Clock size={13} aria-hidden="true" />
            {quest.scheduledFor}
          </span>
        </div>

        <h3 className="quest-card__title">{quest.title}</h3>
        {variant === 'full' ? (
          <p className="quest-card__description">{quest.description}</p>
        ) : null}

        <div className="quest-card__meta">
          <span className={`difficulty difficulty--${quest.difficulty}`}>
            {difficultyLabels[quest.difficulty]}
          </span>
          <span className="xp-reward">+{quest.xp} XP</span>
        </div>
      </div>
    </article>
  )
}
