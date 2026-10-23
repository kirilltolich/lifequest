import { TrendingUp } from 'lucide-react'
import { weeklyGoal, weeklyProgress } from '../data/demoData'

interface WeeklyChartProps {
  bonusXp: number
}

export function WeeklyChart({ bonusXp }: WeeklyChartProps) {
  const points = weeklyProgress.map((day) =>
    day.isToday ? { ...day, value: day.value + Math.max(0, bonusXp) } : day,
  )
  const totalXp = points.reduce((sum, day) => sum + day.value, 0)
  const chartMax = Math.max(140, ...points.map((day) => day.value)) * 1.04

  return (
    <section className="card panel" aria-labelledby="weekly-title">
      <div className="panel__head">
        <div>
          <h2 id="weekly-title">Прогресс за неделю</h2>
          <p className="hint">
            {totalXp} XP из цели {weeklyGoal} XP
          </p>
        </div>
        <span className="pill pill--mint">
          <TrendingUp size={13} aria-hidden="true" />
          +12%
        </span>
      </div>

      <div className="week-chart" role="img" aria-label={`Опыт за неделю: ${totalXp} XP`}>
        {points.map((day) => {
          const height = Math.round((day.value / chartMax) * 100)
          return (
            <div
              key={day.label}
              className={`week-chart__col ${day.isToday ? 'is-today' : ''} ${
                day.isFuture ? 'is-future' : ''
              }`.trim()}
            >
              <span className="week-chart__value">{day.isFuture ? '—' : day.value}</span>
              <div className="week-chart__track">
                <span
                  className="week-chart__bar"
                  style={{ height: day.isFuture ? '0%' : `${Math.max(height, 4)}%` }}
                />
              </div>
              <span className="week-chart__label">{day.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
