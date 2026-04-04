'use client'

import { useLanguage } from '@/lib/i18n/context'

const leaders = [
  { initial: 'F', title: "The Fon's Representative", role: 'Royal Delegate' },
  { initial: 'P', title: 'Community President', role: 'Executive Leadership' },
  { initial: 'S', title: 'Secretary General', role: 'Administration' },
  { initial: 'T', title: 'Treasurer', role: 'Financial Stewardship' },
]

export default function LeadershipSection() {
  const { t } = useLanguage()
  const delays = ['', ' fd1', ' fd2', ' fd3']

  return (
    <section className="section leaders-section" id="leadership">
      <div className="container">
        <div className="section-heading-center fade-in">
          <span className="sec-label">{t('leadership.label')}</span>
          <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: t('leadership.title') }} />
          <p className="sec-desc centered">{t('leadership.desc')}</p>
        </div>

        <div className="leaders-grid">
          {leaders.map((leader, i) => (
            <div key={i} className={`leader-card fade-in${delays[i]}`}>
              <div className="leader-ring">
                <div className="leader-initial">{leader.initial}</div>
              </div>
              <h4>{leader.title}</h4>
              <span className="leader-role">{leader.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
