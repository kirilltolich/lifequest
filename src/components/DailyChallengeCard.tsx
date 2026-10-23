import { ArrowRight, Check, Sparkles } from 'lucide-react'

interface DailyChallengeCardProps {
  completed: number
  target: number
}

const rewardXp = 120

export function DailyChallengeCard({ completed, target }: DailyChallengeCardProps) {
  const done = Math.min(completed, target)
  const isComplete = done >= target

  return (
    <section className="daily-challenge" aria-labelledby="daily-challenge-title">
      <div className="daily-challenge__glow" aria-hidden="true" />

      <div className="daily-challenge__head">
        <span className="daily-challenge__label">
          <Sparkles size={15} aria-hidden="true" />
          Ежедневное испытание
        </span>
        <span className="daily-challenge__reward">+{rewardXp} XP</span>
      </div>

      <h2 id="daily-challenge-title">
        {isComplete ? 'Испытание выполнено!' : 'Три квеста до полуночи'}
      </h2>
      <p className="daily-challenge__text">
        {isComplete
          ? 'Отличный день. Все три квеста выполнены.'
          : 'Завершите три любых квеста сегодня и получите бонусный опыт.'}
      </p>

      <div className="daily-challenge__progress">
        <div className="challenge-dots" aria-hidden="true">
          {Array.from({ length: target }, (_, index) => (
            <span
              key={index}
              className={`challenge-dots__item ${index < done ? 'is-filled' : ''}`.trim()}
            >
              {index < done ? <Check size={12} strokeWidth={3} /> : null}
            </span>
          ))}
        </div>
        <span>
          {done} из {target} квестов
        </span>
      </div>

      <a className="btn btn--light daily-challenge__btn" href="#/quests">
        {isComplete ? 'К квестам' : 'Продолжить'}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </section>
  )
}
