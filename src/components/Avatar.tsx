import type { CSSProperties, ReactNode } from 'react'
import {
  defaultAvatar,
  eyeColors,
  hairColors,
  outfitColors,
  skinTones,
} from '../data/avatarOptions'
import { avatarThemes } from '../data/demoData'
import { getAvatarColor } from '../lib/avatar'
import type { AvatarConfig, AvatarThemeId } from '../types'

interface AvatarProps {
  themeId: AvatarThemeId
  appearance?: AvatarConfig
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

function HairBack({ config, hair }: { config: AvatarConfig; hair: string }) {
  switch (config.hairStyle) {
    case 'short':
      return (
        <path
          d="M32 38C32 20 40 12 50 12s18 8 18 26c-4-7-10-10-18-10s-14 3-18 10Z"
          fill={hair}
        />
      )
    case 'bob':
      return (
        <path
          d="M31 38C31 18 39 11 50 11s19 7 19 27v17c0 4-4 6-7 3L61 39H39l-1 19c-3 3-7 1-7-3Z"
          fill={hair}
        />
      )
    case 'long':
      return (
        <path
          d="M31 38C29 17 38 9 50 9s21 8 19 29l3 38c-2 4-7 6-10 2L60 42H40l-2 36c-3 4-8 2-10-2Z"
          fill={hair}
        />
      )
    case 'curly':
      return (
        <g fill={hair}>
          <circle cx="36" cy="27" r="9" />
          <circle cx="50" cy="20" r="11" />
          <circle cx="64" cy="27" r="9" />
          <circle cx="31" cy="42" r="7" />
          <circle cx="69" cy="42" r="7" />
          <circle cx="34" cy="55" r="5" />
          <circle cx="66" cy="55" r="5" />
        </g>
      )
    case 'bun':
      return (
        <g fill={hair}>
          <circle cx="50" cy="12" r="9" />
          <path d="M31 39c0-19 8-25 19-25s19 6 19 25c-5-7-11-10-19-10s-14 3-19 10Z" />
        </g>
      )
  }
}

function HairFront({ config, hair }: { config: AvatarConfig; hair: string }) {
  switch (config.hairStyle) {
    case 'short':
      return (
        <path
          d="M32 34c1-13 8-17 18-17 9 0 16 4 18 16-5-6-11-8-17-6-7 2-13 5-19 7Z"
          fill={hair}
        />
      )
    case 'bob':
      return (
        <path
          d="M32 34c2-12 9-16 18-16s16 4 18 16c-6-5-12-7-18-7s-12 2-18 7Z"
          fill={hair}
        />
      )
    case 'long':
      return (
        <path
          d="M32 35c2-14 9-19 18-19s16 5 18 19c-4-6-10-8-15-8l-3-3-3 3c-5 0-11 2-15 8Z"
          fill={hair}
        />
      )
    case 'curly':
      return (
        <g fill={hair}>
          <circle cx="38" cy="26" r="6" />
          <circle cx="50" cy="22" r="7" />
          <circle cx="62" cy="26" r="6" />
          <circle cx="33" cy="34" r="4" />
          <circle cx="67" cy="34" r="4" />
        </g>
      )
    case 'bun':
      return (
        <path
          d="M33 33c2-11 9-15 17-15s15 4 17 15c-6-6-12-8-18-6-5 2-11 4-16 6Z"
          fill={hair}
        />
      )
  }
}

function OutfitDetails({ config }: { config: AvatarConfig }) {
  const detail = '#211d36'

  if (config.outfitStyle === 'tee') {
    return (
      <path
        d="M42 74Q50 79 58 74"
        fill="none"
        stroke={detail}
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
    )
  }

  if (config.outfitStyle === 'hoodie') {
    return (
      <g fill="none" stroke={detail} strokeOpacity="0.24" strokeLinecap="round">
        <path d="M38 73Q40 65 50 65t12 8" strokeWidth="3.5" />
        <path d="M45 81v6M55 81v6" strokeWidth="1.8" />
        <path d="M42 91Q50 95 58 91" strokeWidth="1.5" />
      </g>
    )
  }

  return (
    <g fill="none" stroke={detail} strokeOpacity="0.28" strokeLinecap="round">
      <path d="M42 74 50 82l8-8" strokeWidth="2" />
      <path d="M50 82v18" strokeWidth="1.6" />
      <path d="M46 88h8" strokeWidth="1.2" />
    </g>
  )
}

function Accessory({
  config,
  skin,
}: {
  config: AvatarConfig
  skin: string
}): ReactNode {
  if (config.accessory === 'glasses') {
    return (
      <g fill="none" stroke="#2f2a3e" strokeWidth="1.6">
        <rect x="37.5" y="37.5" width="11" height="9" rx="3" />
        <rect x="51.5" y="37.5" width="11" height="9" rx="3" />
        <path d="M48.5 41.5h3M37.5 41H33M62.5 41H67" />
      </g>
    )
  }

  if (config.accessory === 'earrings') {
    return (
      <g fill="#e3b341" stroke={skin} strokeWidth="0.6">
        <circle cx="33.5" cy="46.5" r="1.8" />
        <circle cx="66.5" cy="46.5" r="1.8" />
      </g>
    )
  }

  return null
}

export function Avatar({
  themeId,
  appearance = defaultAvatar,
  size = 'md',
  className = '',
}: AvatarProps) {
  const theme = avatarThemes.find((item) => item.id === themeId) ?? avatarThemes[0]
  const config = appearance ?? defaultAvatar
  const skin = getAvatarColor(skinTones, config.skinTone, '#dfa87c')
  const hair = getAvatarColor(hairColors, config.hairColor, '#6b4226')
  const eye = getAvatarColor(eyeColors, config.eyeColor, '#5a3a28')
  const outfit = getAvatarColor(outfitColors, config.outfitColor, '#7b6af0')

  const style = {
    background: theme.background,
    '--avatar-surface': theme.surface,
    '--avatar-accent': theme.accent,
  } as CSSProperties

  return (
    <div className={`avatar avatar--${size} ${className}`.trim()} style={style}>
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle cx="79" cy="20" r="9" fill="var(--avatar-accent)" opacity="0.55" />
        <circle cx="21" cy="79" r="4" fill="var(--avatar-accent)" opacity="0.35" />

        <path d="M43 56v16q7 6 14 0V56Z" fill={skin} />
        <path
          d="M18 100c2-16 13-26 32-26s30 10 32 26Z"
          fill={outfit}
        />

        <HairBack config={config} hair={hair} />

        <circle cx="33.5" cy="42" r="3.4" fill={skin} />
        <circle cx="66.5" cy="42" r="3.4" fill={skin} />
        <ellipse cx="50" cy="40" rx="16.5" ry="18.5" fill={skin} />

        <HairFront config={config} hair={hair} />

        <ellipse cx="43" cy="42" rx="4.4" ry="3.3" fill="#fff" />
        <ellipse cx="57" cy="42" rx="4.4" ry="3.3" fill="#fff" />
        <circle cx="43.6" cy="42" r="2.3" fill={eye} />
        <circle cx="57.4" cy="42" r="2.3" fill={eye} />
        <circle cx="43.6" cy="42" r="1.05" fill="#2b2430" />
        <circle cx="57.4" cy="42" r="1.05" fill="#2b2430" />
        <circle cx="42.8" cy="41.2" r="0.55" fill="#fff" />
        <circle cx="56.6" cy="41.2" r="0.55" fill="#fff" />

        <g
          fill="none"
          stroke={hair}
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.82"
        >
          {config.browShape === 'soft' ? (
            <>
              <path d="M38 35.5Q42.5 33 47 35.5" />
              <path d="M53 35.5Q57.5 33 62 35.5" />
            </>
          ) : null}
          {config.browShape === 'straight' ? (
            <>
              <path d="M38 35h9" />
              <path d="M53 35h9" />
            </>
          ) : null}
          {config.browShape === 'arched' ? (
            <>
              <path d="M38 36Q42.5 32.5 47 35" />
              <path d="M53 35Q57.5 32.5 62 36" />
            </>
          ) : null}
        </g>

        <circle cx="38" cy="48" r="2.6" fill="#e57e7e" opacity="0.18" />
        <circle cx="62" cy="48" r="2.6" fill="#e57e7e" opacity="0.18" />
        <path
          d="M50 44v3.8q1.2.9 2.4 0"
          fill="none"
          stroke="#211d36"
          strokeOpacity="0.18"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M46.5 51.5Q50 54 53.5 51.5"
          fill="none"
          stroke="#a45f5a"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <OutfitDetails config={config} />
        <Accessory config={config} skin={skin} />
      </svg>
    </div>
  )
}
