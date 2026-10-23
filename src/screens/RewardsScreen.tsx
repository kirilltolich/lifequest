import { Coins, Lock, Sparkles } from 'lucide-react'
import { AchievementCard } from '../components/AchievementCard'
import { Avatar } from '../components/Avatar'
import { ProgressBar } from '../components/ProgressBar'
import { SectionHeader } from '../components/SectionHeader'
import type { Achievement, AvatarConfig, CosmeticItem } from '../types'

interface RewardsScreenProps {
  achievements: Achievement[]
  coins: number
  coinsEarned: number
  coinsSpent: number
  cosmetics: CosmeticItem[]
  avatar: AvatarConfig
  onBuyCosmetic: (id: string) => void
  onEquipCosmetic: (id: string) => void
  notify: (message: string) => void
}

const numberFormatter = new Intl.NumberFormat('ru-RU')

export function RewardsScreen({
  achievements,
  coins,
  coinsEarned,
  coinsSpent,
  cosmetics,
  avatar,
  onBuyCosmetic,
  onEquipCosmetic,
  notify,
}: RewardsScreenProps) {
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length
  const ownedCosmetics = cosmetics.filter((item) => item.status !== 'available').length
  const hasAvailableCosmetics = cosmetics.some((item) => item.status === 'available')

  const openShop = () => {
    if (!hasAvailableCosmetics) {
      notify('Вся косметика уже куплена.')
      return
    }

    document
      .getElementById('cosmetics-title')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    notify('Выберите предмет в магазине ниже.')
  }

  return (
    <div className="screen">
      <SectionHeader
        eyebrow="Коллекция"
        title="Награды"
        description="Достижения и косметика за последовательность в реальной жизни."
      />

      <div className="rewards-top">
        <section className="coin-card" aria-labelledby="coin-title">
          <div className="coin-card__glow" aria-hidden="true" />
          <span className="coin-card__label">
            <Coins size={16} aria-hidden="true" />
            Игровые монеты
          </span>
          <p className="coin-card__value" id="coin-title">
            {numberFormatter.format(coins)}
          </p>
          <p className="coin-card__hint">
            <Sparkles size={14} aria-hidden="true" />
            Заработано {numberFormatter.format(coinsEarned)} · потрачено{' '}
            {numberFormatter.format(coinsSpent)}
          </p>
          <div className="coin-card__next">
            <div className="coin-card__next-row">
              <span>Коллекция косметики</span>
              <span>
                {ownedCosmetics} из {cosmetics.length}
              </span>
            </div>
            <ProgressBar
              value={ownedCosmetics}
              max={cosmetics.length}
              size="sm"
              label="Куплено косметики"
            />
          </div>
          <button type="button" className="btn btn--light coin-card__btn" onClick={openShop}>
            Потратить монеты
          </button>
        </section>

        <section className="card panel cosmetics" aria-labelledby="cosmetics-title">
          <div className="panel__head">
            <div>
              <h2 id="cosmetics-title">Косметика</h2>
              <p className="hint">
                Куплено {ownedCosmetics} из {cosmetics.length}
              </p>
            </div>
          </div>

          <div className="cosmetics__grid">
            {cosmetics.map((item) => {
              const isAvailable = item.status === 'available'
              const isEquipped = item.status === 'equipped'
              const label = isAvailable
                ? `Купить «${item.name}» за ${numberFormatter.format(item.price)} монет`
                : isEquipped
                  ? `«${item.name}» уже надет`
                  : `Надеть «${item.name}»`

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`cosmetic ${isAvailable ? 'is-locked' : 'is-owned'}`.trim()}
                  aria-label={label}
                  aria-pressed={isEquipped}
                  title={
                    isAvailable
                      ? `Купить за ${numberFormatter.format(item.price)} монет`
                      : isEquipped
                        ? 'Этот стиль уже надет'
                        : 'Куплено. Нажмите, чтобы надеть'
                  }
                  onClick={() => {
                    if (isAvailable) {
                      onBuyCosmetic(item.id)
                      return
                    }
                    if (isEquipped) {
                      notify(`Стиль «${item.name}» уже надет.`)
                      return
                    }
                    onEquipCosmetic(item.id)
                  }}
                >
                  <span className="cosmetic__preview">
                    <Avatar themeId={item.theme} appearance={avatar} size="md" />
                    {isAvailable ? (
                      <span className="cosmetic__lock" aria-hidden="true">
                        <Lock size={12} />
                      </span>
                    ) : null}
                  </span>
                  <span className="cosmetic__name">{item.name}</span>
                  {isAvailable ? (
                    <span className="cosmetic__price">
                      <Coins size={12} aria-hidden="true" />
                      Купить · {numberFormatter.format(item.price)}
                    </span>
                  ) : (
                    <span className="cosmetic__status">
                      {isEquipped ? 'Надето' : 'Куплено · надеть'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <section aria-labelledby="achievements-title">
        <div className="block-head">
          <div>
            <h2 id="achievements-title">Достижения</h2>
            <p className="hint">
              Получено {unlockedCount} из {achievements.length}
            </p>
          </div>
          <span className="pill pill--mint">
            <Sparkles size={13} aria-hidden="true" />
            {Math.round((unlockedCount / achievements.length) * 100)}% коллекции
          </span>
        </div>

        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
    </div>
  )
}
