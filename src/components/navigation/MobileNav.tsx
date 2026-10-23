import type { RouteId } from '../../hooks/useHashRoute'
import { navItems } from './navItems'

interface MobileNavProps {
  route: RouteId
}

export function MobileNav({ route }: MobileNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = route === item.id
        return (
          <a
            key={item.id}
            href={`#/${item.id}`}
            className={`bottom-nav__link ${isActive ? 'is-active' : ''}`.trim()}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
