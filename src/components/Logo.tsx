import { Sparkles } from 'lucide-react'

export function Logo() {
  return (
    <span className="brand">
      <span className="brand__mark" aria-hidden="true">
        <Sparkles size={17} strokeWidth={2.4} />
      </span>
      <span className="brand__name">
        LifeQuest<span className="brand__dot">.</span>
      </span>
    </span>
  )
}
