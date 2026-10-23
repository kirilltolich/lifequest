import { Sparkles } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { SkillCard } from '../components/SkillCard'
import { SkillTree } from '../components/SkillTree'
import type { Skill } from '../types'

interface SkillsScreenProps {
  skills: Skill[]
}

export function SkillsScreen({ skills }: SkillsScreenProps) {
  const averageLevel = (
    skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
  ).toFixed(1)

  return (
    <div className="screen">
      <SectionHeader
        eyebrow="Развитие"
        title="Навыки"
        description="Пять направлений, которые растут вместе с вашими реальными привычками."
        actions={
          <span className="pill pill--purple">
            <Sparkles size={14} aria-hidden="true" />
            Средний уровень · {averageLevel}
          </span>
        }
      />

      <div className="skill-grid">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      <p className="hint skills-note">
        Квест приносит навыку своей категории столько же XP, сколько и персонажу. Повторное
        выполнение того же квеста опыт не добавляет.
      </p>

      <SkillTree />
    </div>
  )
}
