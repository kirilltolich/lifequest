import { categoryMap } from '../data/categories'
import type { Skill } from '../types'
import { ProgressBar } from './ProgressBar'

interface SkillCardProps {
  skill: Skill
}

export function SkillCard({ skill }: SkillCardProps) {
  const category = categoryMap[skill.id]
  const CategoryIcon = category.icon
  const percent = Math.round((skill.xp / skill.xpToNext) * 100)
  const remaining = skill.xpToNext - skill.xp

  return (
    <article className={`card skill-card skill-card--${category.tint}`}>
      <div className="skill-card__head">
        <span className={`icon-tile icon-tile--${category.tint}`}>
          <CategoryIcon size={21} aria-hidden="true" />
        </span>
        <span className="level-pill">Ур. {skill.level}</span>
      </div>

      <h3>{category.label}</h3>

      <div className="skill-card__meta">
        <span>
          {skill.xp} / {skill.xpToNext} XP
        </span>
        <span>{percent}%</span>
      </div>
      <ProgressBar
        value={skill.xp}
        max={skill.xpToNext}
        tone={category.tint}
        size="sm"
        label={`Прогресс навыка «${category.label}»`}
      />
      <p className="hint">До {skill.level + 1} уровня — {remaining} XP</p>
    </article>
  )
}
