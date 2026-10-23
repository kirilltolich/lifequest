import { Flame } from 'lucide-react'
import { activityDayLabels, activityDays } from '../data/demoData'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  weekday: 'short',
})

function formatDay(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T12:00:00`))
}

export function ActivityCalendar() {
  return (
    <section className="card panel" aria-labelledby="activity-title">
      <div className="panel__head">
        <div>
          <h2 id="activity-title">Календарь активности</h2>
          <p className="hint">Последние 5 недель · сентябрь — октябрь</p>
        </div>
        <span className="pill pill--coral">
          <Flame size={13} aria-hidden="true" />
          12 дней подряд
        </span>
      </div>

      <div className="activity-calendar">
        <div className="activity-calendar__weekdays" aria-hidden="true">
          {activityDayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="activity-calendar__grid">
          {activityDays.map((day) => (
            <span
              key={day.isoDate}
              className={`activity-calendar__day level-${day.level} ${
                day.isToday ? 'is-today' : ''
              } ${day.isFuture ? 'is-future' : ''}`.trim()}
              title={`${formatDay(day.isoDate)} — ${
                day.isFuture ? 'ещё впереди' : `${day.level * 2} квестов`
              }`}
            >
              <span aria-hidden="true">{Number(day.isoDate.slice(8, 10))}</span>
              {day.isToday ? <span className="sr-only">Сегодня</span> : null}
            </span>
          ))}
        </div>
      </div>

      <div className="activity-calendar__legend">
        <span className="hint">Меньше</span>
        {[0, 1, 2, 3].map((level) => (
          <span key={level} className={`legend-swatch level-${level}`} aria-hidden="true" />
        ))}
        <span className="hint">Больше</span>
      </div>
    </section>
  )
}
