import { ArrowRight, Target } from 'lucide-react'
import { CharacterCard } from '../components/CharacterCard'
import { DailyChallengeCard } from '../components/DailyChallengeCard'
import { ProgressBar } from '../components/ProgressBar'
import { QuestCard } from '../components/QuestCard'
import { SectionHeader } from '../components/SectionHeader'
import { weeklyGoal } from '../data/demoData'
import type { Character, Quest } from '../types'

interface HomeScreenProps {
  character: Character
  quests: Quest[]
  weeklyXp: number
  onToggleQuest: (id: string) => void
}

export function HomeScreen({ character, quests, weeklyXp, onToggleQuest }: HomeScreenProps) {
  const todayQuests = quests.filter((quest) => quest.isToday)
  const completedToday = todayQuests.filter((quest) => quest.completed).length
  const goalRemaining = Math.max(weeklyGoal - weeklyXp, 0)
  const weeklyPercent = Math.round((weeklyXp / weeklyGoal) * 100)

  return (
    <div className="screen">
      <SectionHeader
        eyebrow="Ежедневный обзор"
        title={`С возвращением, ${character.name}!`}
        description="Маленькие шаги каждый день складываются в большую историю."
        actions={
          <a className="pill pill--soft" href="#/profile">
            <Target size={14} aria-hidden="true" />
            {weeklyXp} / {weeklyGoal} XP за неделю
          </a>
        }
      />

      <CharacterCard character={character} weeklyXp={weeklyXp} />

      <div className="home-columns">
        <section className="home-column" aria-labelledby="today-quests-title">
          <div className="block-head">
            <div>
              <h2 id="today-quests-title">Квесты на сегодня</h2>
              <p className="hint">
                Выполнено {completedToday} из {todayQuests.length}
              </p>
            </div>
            <a className="text-link" href="#/quests">
              Все квесты
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="quest-stack">
            {todayQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} variant="compact" onToggle={onToggleQuest} />
            ))}
          </div>
        </section>

        <aside className="home-column home-column--aside">
          <DailyChallengeCard completed={completedToday} target={3} />

          <section className="card panel goal-card" aria-labelledby="weekly-goal-title">
            <div className="panel__head">
              <div>
                <h2 id="weekly-goal-title">Цель недели</h2>
                <p className="hint">
                  {goalRemaining > 0
                    ? `Накопите ${weeklyGoal} XP до воскресенья`
                    : 'Цель достигнута — отличная неделя'}
                </p>
              </div>
              <span className="goal-card__percent">{weeklyPercent}%</span>
            </div>
            <ProgressBar
              value={weeklyXp}
              max={weeklyGoal}
              tone="mint"
              label="Прогресс недельной цели"
            />
            <div className="goal-card__footer">
              <span className="hint">
                {goalRemaining > 0 ? `Осталось ${goalRemaining} XP` : `${weeklyXp} XP набрано`}
              </span>
              <a className="text-link" href="#/profile">
                Статистика
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
