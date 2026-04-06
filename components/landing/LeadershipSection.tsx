'use client'

import { useLanguage } from '@/lib/i18n/context'

const leaders = [
  { initial: 'P', title: 'Community President', role: 'Mr. Ghislain Wassu' },
  { initial: 'VP', title: 'Vice President', role: 'Mr. Guy Kouam', image: '/images/vp-kouam.jpg', imagePosition: 'center 30%' },
  { initial: 'S', title: 'Secretary General', role: 'Mr. Fredy Domleu', image: '/images/secretary-domleu.jpg', imagePosition: 'center 25%' },
  { initial: 'T', title: 'Treasurer', role: 'Mr Francis TEBANG TE BUH TAGNE TEBUWAH', image: '/images/treasurer-tebang.jpg' },
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
                {leader.image ? (
                  <img
                    src={leader.image}
                    alt={leader.role}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: leader.imagePosition || 'center 15%',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <div className="leader-initial">{leader.initial}</div>
                )}
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
