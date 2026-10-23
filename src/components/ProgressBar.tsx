import type { CSSProperties } from 'react'

type Tone = 'purple' | 'mint' | 'amber' | 'sky' | 'coral'

interface ProgressBarProps {
  value: number
  max: number
  tone?: Tone
  size?: 'sm' | 'md'
  label: string
}

export function ProgressBar({ value, max, tone = 'purple', size = 'md', label }: ProgressBarProps) {
  const safeMax = Math.max(max, 1)
  const safeValue = Math.min(Math.max(value, 0), safeMax)
  const percent = Math.round((safeValue / safeMax) * 100)

  return (
    <div
      className={`progress progress--${size} progress--${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
    >
      <span className="progress__fill" style={{ width: `${percent}%` } as CSSProperties} />
    </div>
  )
}
