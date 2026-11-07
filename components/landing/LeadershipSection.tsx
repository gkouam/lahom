'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/context'

const leaders = [
  { titleKey: 'leadership.role.president', name: 'Ghislain Wassu', image: '/images/president-wassu.jpg', imagePosition: 'center 20%' },
  { titleKey: 'leadership.role.vp', name: 'Guy Kouam', image: '/images/vp-kouam.jpg', imagePosition: 'center 30%' },
  { titleKey: 'leadership.role.secretary', name: 'Fredy Domleu', image: '/images/secretary-domleu.jpg', imagePosition: 'center 15%' },
  { titleKey: 'leadership.role.treasurer', name: 'Francis Tebang Te Buh Tagne Tebuwah', image: '/images/treasurer-tebang.jpg', imagePosition: 'center 15%' },
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
            <div key={leader.name} className={`leader-card fade-in${delays[i]}`}>
              <div className="leader-ring">
                {/* next/image serves a small, sized copy instead of the full-size upload. */}
                <Image
                  src={leader.image}
                  alt={`${t('leadership.honorific')} ${leader.name}`}
                  width={240}
                  height={240}
                  sizes="122px"
                  className="leader-photo"
                  style={{ objectPosition: leader.imagePosition }}
                />
              </div>
              <h4>{t(leader.titleKey)}</h4>
              <span className="leader-role">{t('leadership.honorific')} {leader.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
