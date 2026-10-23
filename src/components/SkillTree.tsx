import {
  BookOpen,
  Check,
  Crosshair,
  Lock,
  Moon,
  Shield,
  Sunrise,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { categoryMap } from '../data/categories'
import { skillTree } from '../data/demoData'
import type { SkillTreeNode } from '../types'

const nodeIcons: Record<SkillTreeNode['icon'], LucideIcon> = {
  sun: Sunrise,
  moon: Moon,
  focus: Crosshair,
  book: BookOpen,
  shield: Shield,
  chart: TrendingUp,
}

export function SkillTree() {
  return (
    <section className="card skill-tree" aria-labelledby="skill-tree-title">
      <div className="panel__head">
        <div>
          <div className="skill-tree__title-row">
            <h2 id="skill-tree-title">Дерево навыков</h2>
            <span className="pill pill--soft">Скоро</span>
          </div>
          <p className="hint">
            Открывайте способности, прокачивая навыки. Ветки уже готовы к развитию.
          </p>
        </div>
      </div>

      <div className="skill-tree__grid">
        {skillTree.map((branch) => {
          const category = categoryMap[branch.id]
          const CategoryIcon = category.icon

          return (
            <div className="skill-tree__branch" key={branch.id}>
              <div className="skill-tree__root">
                <span className={`icon-tile icon-tile--${category.tint} icon-tile--sm`}>
                  <CategoryIcon size={17} aria-hidden="true" />
                </span>
                <span>{category.label}</span>
              </div>
              <span className="skill-tree__connector" aria-hidden="true" />
              <div className="skill-tree__nodes">
                {branch.nodes.map((node) => {
                  const NodeIcon = nodeIcons[node.icon]
                  const isOpen = node.status === 'open'
                  return (
                    <article
                      key={node.id}
                      className={`skill-node ${isOpen ? 'is-open' : 'is-locked'}`}
                    >
                      <span className="skill-node__icon">
                        <NodeIcon size={16} aria-hidden="true" />
                      </span>
                      <div className="skill-node__text">
                        <h3>{node.title}</h3>
                        <p>{node.subtitle}</p>
                      </div>
                      <span className="skill-node__status" aria-hidden="true">
                        {isOpen ? <Check size={13} /> : <Lock size={12} />}
                      </span>
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
