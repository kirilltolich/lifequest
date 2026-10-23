import {
  BookOpen,
  Check,
  Crown,
  Flame,
  Footprints,
  Lock,
  Shield,
  Sunrise,
  Target,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Achievement } from '../types'
import { ProgressBar } from './ProgressBar'

const achievementIcons: Record<Achievement['icon'], LucideIcon> = {
  'first-step': Footprints,
  streak: Flame,
  month: Sunrise,
  marathon: Crown,
  focus: Target,
  finance: Wallet,
  early: BookOpen,
  legend: Shield,
}

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const Icon = achievementIcons[achievement.icon]

  return (
    <article
      className={`card achievement-card ${achievement.unlocked ? 'is-open' : 'is-locked'}`}
    >
      <div className="achievement-card__head">
        <span className="achievement-card__icon">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className={`status-badge ${achievement.unlocked ? 'status-badge--open' : ''}`}>
          {achievement.unlocked ? (
            <>
              <Check size={12} aria-hidden="true" />
              Открыто
            </>
          ) : (
            <>
              <Lock size={11} aria-hidden="true" />
              Не получено
            </>
          )}
        </span>
      </div>

      <h3>{achievement.title}</h3>
      <p className="achievement-card__description">{achievement.description}</p>

      {!achievement.unlocked && achievement.progress ? (
        <div className="achievement-card__progress">
          <ProgressBar
            value={achievement.progress.current}
            max={achievement.progress.total}
            tone="mint"
            size="sm"
            label={`Прогресс достижения «${achievement.title}»`}
          />
          <span className="hint">
            {achievement.progress.current} / {achievement.progress.total}
          </span>
        </div>
      ) : null}

      {achievement.unlocked && achievement.earnedAt ? (
        <p className="achievement-card__earned">Получено {achievement.earnedAt}</p>
      ) : null}
    </article>
  )
}
