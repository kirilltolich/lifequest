import { useState, type FormEvent } from 'react'
import { categories, difficultyLabels } from '../data/categories'
import { getQuestCoinReward } from '../lib/shop'
import type { CategoryId, Difficulty, Quest } from '../types'
import { Modal } from './Modal'

export type NewQuestInput = Pick<
  Quest,
  'title' | 'description' | 'category' | 'difficulty' | 'xp' | 'scheduledFor'
>

interface QuestFormModalProps {
  open: boolean
  onClose: () => void
  onCreate: (quest: NewQuestInput) => void
}

const xpByDifficulty: Record<Difficulty, number> = {
  easy: 40,
  medium: 60,
  hard: 90,
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

export function QuestFormModal({ open, onClose, onCreate }: QuestFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CategoryId>('health')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [time, setTime] = useState('18:00')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    onCreate({
      title: trimmedTitle,
      description: description.trim() || 'Без описания — просто сделайте это.',
      category,
      difficulty,
      xp: xpByDifficulty[difficulty],
      scheduledFor: time || '18:00',
    })

    setTitle('')
    setDescription('')
    setCategory('health')
    setDifficulty('medium')
    setTime('18:00')
    onClose()
  }

  return (
    <Modal
      open={open}
      title="Новый квест"
      subtitle="Квест сохранится в этом браузере."
      onClose={onClose}
    >
      <form className="quest-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="quest-title">Название</label>
          <input
            id="quest-title"
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, пробежать 3 км"
            maxLength={60}
            required
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="quest-description">Описание</label>
          <textarea
            id="quest-description"
            className="input input--textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Что именно нужно сделать?"
            rows={3}
            maxLength={160}
          />
        </div>

        <fieldset className="field">
          <legend>Категория</legend>
          <div className="option-grid option-grid--categories">
            {categories.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`option-chip ${category === item.id ? 'is-selected' : ''}`.trim()}
                  onClick={() => setCategory(item.id)}
                  aria-pressed={category === item.id}
                >
                  <span className={`icon-tile icon-tile--${item.tint} icon-tile--xs`}>
                    <Icon size={13} aria-hidden="true" />
                  </span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="quest-form__row">
          <fieldset className="field">
            <legend>Сложность</legend>
            <div className="segmented">
              {difficulties.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`segmented__item ${difficulty === level ? 'is-selected' : ''}`.trim()}
                  onClick={() => setDifficulty(level)}
                  aria-pressed={difficulty === level}
                >
                  {difficultyLabels[level]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="quest-time">Время</label>
            <input
              id="quest-time"
              className="input"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>

        <footer className="quest-form__footer">
          <span className="quest-form__reward">
            Награда: <strong>+{xpByDifficulty[difficulty]} XP</strong> ·{' '}
            <strong>+{getQuestCoinReward(difficulty)} монет</strong>
          </span>
          <div className="quest-form__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              Создать квест
            </button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
