import { useEffect, useState } from 'react'

export const routeIds = ['home', 'quests', 'skills', 'rewards', 'profile'] as const
export type RouteId = (typeof routeIds)[number]

export function isRouteId(value: string): value is RouteId {
  return (routeIds as readonly string[]).includes(value)
}

function getRouteFromHash(): RouteId {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return isRouteId(raw) ? raw : 'home'
}

/**
 * Hash routing keeps deep links working on GitHub Pages without server
 * rewrites: every section lives at #/quests, #/skills, etc.
 */
export function useHashRoute(): RouteId {
  const [route, setRoute] = useState<RouteId>(getRouteFromHash)

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/home')
    }

    const onHashChange = () => {
      setRoute(getRouteFromHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}
