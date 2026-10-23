import { Award, CheckCircle2, Flame, Pencil, TrendingUp } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { ActivityCalendar } from '../components/ActivityCalendar'
import { Avatar } from '../components/Avatar'
import { ProgressBar } from '../components/ProgressBar'
import { SectionHeader } from '../components/SectionHeader'
import { WeeklyChart } from '../components/WeeklyChart'
import { categoryMap } from '../data/categories'
import { avatarThemes } from '../data/demoData'
import type {
  Achievement,
  AvatarTheme,
  AvatarThemeId,
  Character,
  Skill,
} from '../types'

interface ProfileScreenProps {
  character: Character
  skills: Skill[]
  achievements: Achievement[]
  ownedThemes: AvatarTheme[]
  bonusWeeklyXp: number
  onUpdateName: (name: string) => void
  onUpdateAvatarTheme: (themeId: AvatarThemeId) => void
  onOpenAvatarBuilder: () => void
  notify: (message: string) => void
}

const numberFormatter = new Intl.NumberFormat('ru-RU')

export function ProfileScreen({
  character,
  skills,
  achievements,
  ownedThemes,
  bonusWeeklyXp,
  onUpdateName,
  onUpdateAvatarTheme,
  onOpenAvatarBuilder,
  notify,
}: ProfileScreenProps) {
  const [name, setName] = useState(character.name)
  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked).length
  const topSkill = skills.reduce((best, skill) => (skill.level > best.level ? skill : best), skills[0])
  const topSkillCategory = categoryMap[topSkill.id]
  const TopSkillIcon = topSkillCategory.icon

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      notify('Имя персонажа не может быть пустым.')
      return
    }
    onUpdateName(trimmed)
    notify('Имя сохранено в браузере.')
  }

  const stats = [
    {
      id: 'xp',
      label: 'Всего опыта',
      value: `${numberFormatter.format(character.totalXp)} XP`,
      icon: TrendingUp,
      tint: 'purple',
    },
    {
      id: 'quests',
      label: 'Квестов выполнено',
      value: String(character.questsCompleted),
      icon: CheckCircle2,
      tint: 'mint',
    },
    {
      id: 'streak',
      label: 'Текущая серия',
      value: `${character.streak} дней`,
      icon: Flame,
      tint: 'coral',
    },
    {
      id: 'achievements',
      label: 'Достижения',
      value: `${unlockedAchievements} из ${achievements.length}`,
      icon: Award,
      tint: 'amber',
    },
  ]

  return (
    <div className="screen">
      <SectionHeader
        eyebrow="Личный кабинет"
        title="Профиль"
        description="Управляйте персонажем и наблюдайте, как растёт ваш прогресс."
        actions={
          <span className="pill pill--purple">
            <Award size={14} aria-hidden="true" />
            Уровень {character.level}
          </span>
        }
      />

      <div className="profile-grid">
        <section className="card profile-card" aria-labelledby="profile-name">
          <div className="profile-card__hero">
            <Avatar
              themeId={character.avatarTheme}
              appearance={character.avatar}
              size="lg"
            />
            <div className="profile-card__identity">
              <h2 id="profile-name">{character.name}</h2>
              <p className="hint">{character.title}</p>
              <div className="profile-card__level-row">
                <span className="pill pill--purple">Уровень {character.level}</span>
                <span className="hint">
                  {character.xp} / {character.xpToNext} XP
                </span>
              </div>
            </div>
          </div>

          <ProgressBar
            value={character.xp}
            max={character.xpToNext}
            label="Опыт персонажа"
          />
          <p className="hint profile-card__next">
            До {character.level + 1} уровня — {character.xpToNext - character.xp} XP
          </p>

          <div className="profile-card__divider" aria-hidden="true" />

          <form className="name-form" onSubmit={handleSubmit}>
            <label htmlFor="character-name">Имя персонажа</label>
            <div className="name-form__row">
              <input
                id="character-name"
                className="input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={20}
                autoComplete="off"
              />
              <button type="submit" className="btn btn--primary btn--sm">
                Сохранить
              </button>
            </div>
            <p className="hint">До 20 символов. Имя сохраняется в этом браузере.</p>
          </form>

          <div className="theme-picker">
            <div className="theme-picker__head">
              <p className="field-label">Фон аватара</p>
              <button
                type="button"
                className="btn btn--soft btn--sm"
                onClick={onOpenAvatarBuilder}
              >
                <Pencil size={14} aria-hidden="true" />
                Настроить персонажа
              </button>
            </div>
            <div className="theme-picker__grid" role="group" aria-label="Фон аватара">
              {ownedThemes.map((theme) => {
                const isActive = character.avatarTheme === theme.id
                return (
                  <button
                    key={theme.id}
                    type="button"
                    className={`theme-option ${isActive ? 'is-active' : ''}`.trim()}
                    onClick={() => onUpdateAvatarTheme(theme.id)}
                    aria-pressed={isActive}
                  >
                    <Avatar
                      themeId={theme.id}
                      appearance={character.avatar}
                      size="sm"
                    />
                    <span>{theme.name}</span>
                  </button>
                )
              })}
            </div>
            {ownedThemes.length < avatarThemes.length ? (
              <p className="hint">Новые стили открываются в магазине наград.</p>
            ) : null}
          </div>
        </section>

        <div className="profile-side">
          <div className="stat-grid">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <article className="card stat-card" key={stat.id}>
                  <span className={`icon-tile icon-tile--${stat.tint}`}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="stat-card__value">{stat.value}</p>
                    <p className="stat-card__label">{stat.label}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <section className="card panel profile-note" aria-label="Ближайшая цель">
            <div className="panel__head">
              <div>
                <h2>Ближайшая цель</h2>
                <p className="hint">Опыт для нового уровня</p>
              </div>
              <span className="pill pill--soft">
                {Math.round((character.xp / character.xpToNext) * 100)}%
              </span>
            </div>
            <ProgressBar
              value={character.xp}
              max={character.xpToNext}
              label="Прогресс до следующего уровня"
            />
            <p className="hint">
              Осталось {character.xpToNext - character.xp} XP — это{' '}
              {Math.ceil((character.xpToNext - character.xp) / 60)} квестов средней сложности.
            </p>
          </section>

          <section className="card panel strength-card" aria-labelledby="top-skill-title">
            <div className="strength-card__head">
              <span className={`icon-tile icon-tile--${topSkillCategory.tint}`}>
                <TopSkillIcon size={19} aria-hidden="true" />
              </span>
              <div className="strength-card__identity">
                <p className="strength-card__eyebrow" id="top-skill-title">
                  Сильнейший навык
                </p>
                <div className="strength-card__row">
                  <h2>{topSkillCategory.label}</h2>
                  <span className="level-pill">Ур. {topSkill.level}</span>
                </div>
              </div>
            </div>
            <ProgressBar
              value={topSkill.xp}
              max={topSkill.xpToNext}
              tone={topSkillCategory.tint}
              size="sm"
              label={`Прогресс навыка «${topSkillCategory.label}»`}
            />
            <p className="hint">
              {topSkill.xp} / {topSkill.xpToNext} XP · до {topSkill.level + 1} уровня —{' '}
              {topSkill.xpToNext - topSkill.xp} XP
            </p>
          </section>
        </div>
      </div>

      <div className="profile-charts">
        <ActivityCalendar />
        <WeeklyChart bonusXp={bonusWeeklyXp} />
      </div>
    </div>
  )
}
