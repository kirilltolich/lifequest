import { Check, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import {
  accessories,
  browShapes,
  defaultAvatar,
  eyeColors,
  hairColors,
  hairStyles,
  outfitColors,
  outfitStyles,
  skinTones,
} from '../data/avatarOptions'
import type {
  AvatarConfig,
  AvatarOption,
  AvatarThemeId,
} from '../types'
import { Avatar } from './Avatar'
import { Modal } from './Modal'

interface AvatarBuilderProps {
  open: boolean
  avatar: AvatarConfig
  themeId: AvatarThemeId
  onClose: () => void
  onSave: (avatar: AvatarConfig) => void
}

function ColorGrid<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: AvatarOption<T>[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div className="avatar-builder__section">
      <p className="field-label">{label}</p>
      <div className="avatar-builder__swatches" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`avatar-swatch ${value === option.id ? 'is-selected' : ''}`.trim()}
            style={{ background: option.color }}
            aria-label={option.label}
            aria-pressed={value === option.id}
            title={option.label}
            onClick={() => onChange(option.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ChoiceGrid<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: AvatarOption<T>[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div className="avatar-builder__section">
      <p className="field-label">{label}</p>
      <div className="option-grid" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`option-chip ${value === option.id ? 'is-selected' : ''}`.trim()}
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function AvatarBuilder({
  open,
  avatar,
  themeId,
  onClose,
  onSave,
}: AvatarBuilderProps) {
  const [draft, setDraft] = useState<AvatarConfig>(avatar)

  const update = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <Modal
      open={open}
      title="Конструктор персонажа"
      subtitle="Соберите образ из простых форм. Изменения видны сразу."
      onClose={onClose}
    >
      <div className="avatar-builder">
        <div className="avatar-builder__preview">
          <Avatar
            themeId={themeId}
            appearance={draft}
            size="xl"
            className="avatar-builder__avatar"
          />
          <div>
            <p className="eyebrow">Предпросмотр</p>
            <p className="hint">
              Это тот же персонаж, который появится в профиле, на главной и в наградах.
            </p>
            <p className="hint">«Сбросить» вернёт исходный образ после сохранения.</p>
          </div>
        </div>

        <ColorGrid
          label="Оттенок кожи"
          options={skinTones}
          value={draft.skinTone}
          onChange={(id) => update('skinTone', id)}
        />

        <div className="avatar-builder__grid">
          <ChoiceGrid
            label="Причёска"
            options={hairStyles}
            value={draft.hairStyle}
            onChange={(id) => update('hairStyle', id)}
          />
          <ColorGrid
            label="Цвет волос"
            options={hairColors}
            value={draft.hairColor}
            onChange={(id) => update('hairColor', id)}
          />
          <ColorGrid
            label="Цвет глаз"
            options={eyeColors}
            value={draft.eyeColor}
            onChange={(id) => update('eyeColor', id)}
          />
          <ChoiceGrid
            label="Форма бровей"
            options={browShapes}
            value={draft.browShape}
            onChange={(id) => update('browShape', id)}
          />
          <ChoiceGrid
            label="Одежда"
            options={outfitStyles}
            value={draft.outfitStyle}
            onChange={(id) => update('outfitStyle', id)}
          />
          <ColorGrid
            label="Цвет одежды"
            options={outfitColors}
            value={draft.outfitColor}
            onChange={(id) => update('outfitColor', id)}
          />
        </div>

        <ChoiceGrid
          label="Дополнительные элементы"
          options={accessories}
          value={draft.accessory}
          onChange={(id) => update('accessory', id)}
        />

        <footer className="avatar-builder__footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setDraft({ ...defaultAvatar })}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Сбросить
          </button>
          <div className="avatar-builder__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Отмена
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                onSave(draft)
                onClose()
              }}
            >
              <Check size={16} aria-hidden="true" />
              Сохранить внешность
            </button>
          </div>
        </footer>
      </div>
    </Modal>
  )
}
