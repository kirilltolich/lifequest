import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { QuestCard } from '../components/QuestCard'
import { QuestFormModal, type NewQuestInput } from '../components/QuestFormModal'
import { SectionHeader } from '../components/SectionHeader'
import { categories } from '../data/categories'
import type { CategoryId, Quest } from '../types'

interface QuestsScreenProps {
  quests: Quest[]
  onToggleQuest: (id: string) => void
  onCreateQuest: (quest: NewQuestInput) => void
  notify: (message: string) => void
}

type QuestFilter = CategoryId | 'all'

export function QuestsScreen({ quests, onToggleQuest, onCreateQuest, notify }: QuestsScreenProps) {
  const [filter, setFilter] = useState<QuestFilter>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const counts = useMemo(() => {
    return quests.reduce<Record<string, number>>(
      (accumulator, quest) => {
        accumulator[quest.category] = (accumulator[quest.category] ?? 0) + 1
        return accumulator
      },
      { all: quests.length },
    )
  }, [quests])

  const filteredQuests = useMemo(
    () => (filter === 'all' ? quests : quests.filter((quest) => quest.category === filter)),
    [filter, quests],
  )

  const handleCreate = (input: NewQuestInput) => {
    onCreateQuest(input)
    setFilter('all')
    notify(`Квест «${input.title}» создан и сохранён в браузере.`)
  }

  return (
    <div className="screen">
      <SectionHeader
        eyebrow="Задания"
        title="Квесты"
        description="Реальные задачи, которые приносят опыт и приближают новый уровень."
        actions={
          <button type="button" className="btn btn--primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={17} aria-hidden="true" />
            Новый квест
          </button>
        }
      />

      <div className="filter-bar" role="group" aria-label="Фильтр квестов по категориям">
        <button
          type="button"
          className={`filter-chip ${filter === 'all' ? 'is-active' : ''}`.trim()}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          Все
          <span className="filter-chip__count">{counts.all ?? 0}</span>
        </button>

        {categories.map((category) => {
          const Icon = category.icon
          const isActive = filter === category.id
          return (
            <button
              key={category.id}
              type="button"
              className={`filter-chip filter-chip--${category.tint} ${
                isActive ? 'is-active' : ''
              }`.trim()}
              onClick={() => setFilter(category.id)}
              aria-pressed={isActive}
            >
              <Icon size={14} aria-hidden="true" />
              {category.label}
              <span className="filter-chip__count">{counts[category.id] ?? 0}</span>
            </button>
          )
        })}
      </div>

      {filteredQuests.length > 0 ? (
        <div className="quest-list">
          {filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onToggle={onToggleQuest} />
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <h2>Здесь пока пусто</h2>
          <p className="hint">Создайте первый квест в этой категории — начните с небольшого шага.</p>
          <button type="button" className="btn btn--soft" onClick={() => setIsFormOpen(true)}>
            <Plus size={16} aria-hidden="true" />
            Создать квест
          </button>
        </div>
      )}

      <QuestFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
