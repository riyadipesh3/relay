import { useEffect, useRef, useState, type ReactNode } from 'react'

/* Shared primitives. Scroll reveal uses IntersectionObserver, never a scroll
   listener, and collapses to fully visible under prefers-reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Heading stacks vertically with its body underneath. Never a split header. */
function SectionHead({
  kicker,
  title,
  body,
}: {
  kicker?: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-2xl">
      {kicker ? <p className="micro mb-5">{kicker}</p> : null}
      <h2 className="display display-md">{title}</h2>
      {body ? <p className="lede mt-6">{body}</p> : null}
    </div>
  )
}

const NAV = ['Platform', 'How it works', 'Pricing', 'Questions']

/* Logo wall. Marks are drawn as inline SVG geometry so the strip reads as a
   wall of logos rather than a list of names. No category labels underneath. */
const LOGOS = [
  { name: 'Ferroway', mark: 'F', shape: 'square' },
  { name: 'Aldburn', mark: 'A', shape: 'circle' },
  { name: 'Kestrel', mark: 'K', shape: 'filled' },
  { name: 'Corvid Labs', mark: 'C', shape: 'diamond' },
  { name: 'Marrow', mark: 'M', shape: 'notch' },
  { name: 'Pell & Roak', mark: 'P', shape: 'circle' },
]

function Monogram({ mark, shape }: { mark: string; shape: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    className: 'shrink-0 text-[var(--color-mute)]',
  } as const
  const glyph = (
    <text
      x="12"
      y="16.4"
      textAnchor="middle"
      fontFamily="Geist Variable, sans-serif"
      fontSize="12"
      fontWeight="650"
      fill="currentColor"
    >
      {mark}
    </text>
  )

  if (shape === 'circle') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="11.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {glyph}
      </svg>
    )
  }
  if (shape === 'filled') {
    return (
      <svg {...common}>
        <rect width="22.5" height="22.5" x="0.75" y="0.75" fill="currentColor" />
        <text
          x="12"
          y="16.4"
          textAnchor="middle"
          fontFamily="Geist Variable, sans-serif"
          fontSize="12"
          fontWeight="650"
          fill="var(--color-canvas)"
        >
          {mark}
        </text>
      </svg>
    )
  }
  if (shape === 'diamond') {
    return (
      <svg {...common}>
        <path
          d="M12 1.5 22.5 12 12 22.5 1.5 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {glyph}
      </svg>
    )
  }
  if (shape === 'notch') {
    return (
      <svg {...common}>
        <path
          d="M0.75 6.5V0.75h5.75M23.25 6.5V0.75h-5.75M0.75 17.5v5.75h5.75M23.25 17.5v5.75h-5.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {glyph}
      </svg>
    )
  }
  return (
    <svg {...common}>
      <rect
        x="0.75"
        y="0.75"
        width="22.5"
        height="22.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {glyph}
    </svg>
  )
}

type Feature = {
  kicker: string
  title: string
  body: string
  ladder?: readonly string[]
  channels?: readonly string[]
  stats?: readonly { k: string; v: string }[]
}

/* Feature bento. Exactly five items, exactly five cells. Three cells carry a
   real visual treatment: a CSS-drawn routing diagram, a tinted panel, and a
   real photograph. The remaining two stay quiet so the grid reads as a grid. */
const FEATURES: readonly Feature[] = [
  {
    kicker: 'Ownership',
    title: 'One owner per item, always named',
    body: 'A routed item carries a single accountable name from pickup to close. If nobody accepts it inside the window, Relay reassigns instead of letting it sit.',
  },
  {
    kicker: 'Deadlines',
    title: 'Escalation on a clock, not on memory',
    body: 'Set the escalation path once per queue. Relay nudges the owner, then the owner above them, then the team channel. You watch it happen in the audit log.',
    ladder: ['Item owner', 'Queue lead', 'Team channel'],
  },
  {
    kicker: 'Integrations',
    title: 'Two-way sync with the tools you already run',
    body: 'State changes land in the channel your team reads and come back as updates. No copy-paste between a tracker, a chat thread, and a spreadsheet.',
    channels: ['Chat threads', 'Issue trackers', 'Shared inboxes', 'Data warehouse'],
  },
  {
    kicker: 'Evidence',
    title: 'An audit trail you can hand to a reviewer',
    body: 'Every accept, reassign, and escalation is timestamped and exportable. Answers stop being archaeology.',
  },
  {
    kicker: 'Reporting',
    title: 'Numbers your operations lead will read',
    body: 'Queues, ageing, and stalls by team, with the same definition every month so the trend means something.',
    stats: [
      { k: 'Median time to acknowledge', v: '9 min' },
      { k: 'Items closed past due', v: '3.1%' },
    ],
  },
]

const STEPS = [
  {
    n: '01',
    when: 'Week one',
    title: 'Map the queues you lose work in',
    body: 'Bring the three handoffs that hurt most. We model owners, accept windows, and the fallback for each one.',
    out: 'A queue map in your workspace',
  },
  {
    n: '02',
    when: 'Weeks two to three',
    title: 'Turn the map into routing rules',
    body: 'Rules are written in plain language and previewed against last quarter of real tickets before anything goes live.',
    out: 'Routing preview on real history',
  },
  {
    n: '03',
    when: 'Week four',
    title: 'Run it live on one team',
    body: 'One team runs Relay for a month beside the old process. You keep both until the numbers agree.',
    out: 'A decision, with the numbers behind it',
  },
]

const TIERS = [
  {
    name: 'Team',
    price: '$24',
    unit: 'per seat, billed monthly',
    note: 'One workspace, up to 12 seats. Cancel monthly.',
    features: [
      'Up to 12 seats in one workspace',
      'Unlimited items and handoffs',
      'Owner, accept window, and due date rules',
      'Two-way sync for chat threads and email',
      '90-day audit history',
      'Email support, next business day',
    ],
  },
  {
    name: 'Business',
    price: '$56',
    unit: 'per seat, billed monthly',
    note: 'Annual invoicing available. Seat count can flex by 20 percent a quarter.',
    features: [
      'Unlimited seats and workspaces',
      'Approval chains up to four levels',
      'Single sign-on with SAML and SCIM',
      'Audit export to CSV or your warehouse',
      'Custom escalation paths per queue',
      'Named support engineer, four-hour response',
    ],
  },
]

const FAQS = [
  {
    q: 'What counts as a handoff in Relay?',
    a: 'Any item that moves from one named owner to another, including work passed to a team rather than a person. Items that never leave the originating team are not counted as handoffs.',
  },
  {
    q: 'Does this replace our project tracker?',
    a: 'No. Relay tracks the handover between people, not the work itself. Most teams keep their tracker for scope and schedule and let Relay own the moment ownership changes.',
  },
  {
    q: 'How long does setup take?',
    a: 'One queue can be live in an afternoon. A full workspace mapped across four or five queues usually takes two to three weeks, most of which is waiting on your team to confirm who owns what.',
  },
  {
    q: 'Where is our data stored?',
    a: 'You choose the region at signup: US or EU. Backups are encrypted with the same key and kept in the same region. Nothing leaves the region you pick.',
  },
  {
    q: 'Can we use our own identity provider?',
    a: 'Yes, on the Business plan. SAML and SCIM are supported, and deprovisioning in your provider removes access immediately rather than at the next sync.',
  },
  {
    q: 'What happens at the seat limit?',
    a: 'Existing seats keep working. Additional seats are billed pro rata from the day they are added, and the workspace owner is notified each time a seat crosses the plan limit.',
  },
]

export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-canvas)]"
      >
        Skip to content
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* NAV - single line at desktop, 68px                              */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/92 backdrop-blur-sm">
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="text-[var(--color-accent)]">
              <path
                d="M3.5 3.5h13v13h-13z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path d="M3.5 10h13" fill="none" stroke="currentColor" strokeWidth="1.75" />
            </svg>
            <a
              href="#top"
              className="font-display text-[1.0625rem] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
            >
              Relay
            </a>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-[0.875rem] font-medium text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]"
              >
                {item}
              </a>
            ))}
          </nav>

          <a href="#pricing" className="btn btn-primary hidden md:inline-flex">
            Request a demo
          </a>

          <button
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border border-[var(--color-hairline)] text-[var(--color-ink)] md:hidden"
          >
            <span className="flex w-4 flex-col gap-[4px]">
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? 'translate-y-[2.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? '-translate-y-[2.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {navOpen ? (
          <div id="mobile-nav" className="border-t border-[var(--color-hairline)] md:hidden">
            <nav className="shell flex flex-col py-4">
              {NAV.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setNavOpen(false)}
                  className="border-b border-[var(--color-hairline)] py-3.5 text-[1rem] font-medium text-[var(--color-ink)] last:border-b-0"
                >
                  {item}
                </a>
              ))}
              <a
                href="#pricing"
                onClick={() => setNavOpen(false)}
                className="btn btn-primary mt-5 w-full"
              >
                Request a demo
              </a>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main">
        {/* -------------------------------------------------------------- */}
        {/* HERO - asymmetric split, real photograph on the right            */}
        {/* -------------------------------------------------------------- */}
        <section id="top" className="shell pt-16 pb-16 md:pt-24 md:pb-20">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p className="micro mb-6">Operations handoff software</p>
              <h1 className="display display-xl">
                Nothing gets stuck
                <br />
                between two teams.
              </h1>
              <p className="lede mt-8">
                Relay routes work to a named owner, records who accepted it, and
                escalates whatever stalls. One record of every handover.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#pricing" className="btn btn-primary">
                  Request a demo
                </a>
                <a href="#how-it-works" className="btn btn-secondary">
                  See how it works
                </a>
              </div>
            </div>

            <Reveal className="lg:col-span-6 lg:pt-14">
              <figure>
                <div className="frame aspect-4/5 w-full">
                  <img
                    src="https://picsum.photos/seed/relay-cool-40/1200/1500"
                    alt="Wet shoreline stones under low cloud, cool grey and blue tones"
                    loading="eager"
                    width={1200}
                    height={1500}
                  />
                </div>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* LOGO WALL - logos only, sits under the hero, never inside it     */}
        {/* -------------------------------------------------------------- */}
        <section aria-label="Teams running Relay" className="border-y border-[var(--color-hairline)] py-10">
          <ul className="shell grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {LOGOS.map((l) => (
              <li key={l.name} className="flex items-center gap-2.5">
                <Monogram mark={l.mark} shape={l.shape} />
                <span className="font-display text-[0.9375rem] font-medium tracking-[-0.02em] text-[var(--color-body)]">
                  {l.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* FEATURES - bento, five items in five cells                      */}
        {/* -------------------------------------------------------------- */}
        <section id="platform" className="shell py-24 md:py-28">
          <Reveal>
            <SectionHead
              kicker="The platform"
              title="The parts of a handover that usually fall through"
              body="Routing, ownership, evidence, and reporting, built as one record instead of four tools that disagree."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-6">
            {/* Cell 1 - pattern ground plus a CSS-drawn routing diagram */}
            <Reveal className="lg:col-span-3">
              <article className="pattern-grid flex h-full flex-col p-7 md:p-8">
                <p className="meta">Routing rules</p>
                <h3 className="display mt-4 text-[clamp(1.15rem,1.6vw,1.4rem)]">
                  {FEATURES[0].title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-[var(--color-body)]">
                  {FEATURES[0].body}
                </p>
                <svg
                  viewBox="0 0 320 110"
                  className="mt-7 w-full"
                  role="img"
                  aria-label="Diagram of four incoming requests routed through one assignment node to two teams"
                >
                  <g stroke="var(--color-accent)" strokeOpacity="0.4" strokeWidth="1">
                    <path d="M34 22h52v33" fill="none" />
                    <path d="M34 55h52" fill="none" />
                    <path d="M34 88h52V55" fill="none" />
                    <path d="M160 55h44" fill="none" />
                    <path d="M204 55 244 30" fill="none" />
                    <path d="M204 55 244 80" fill="none" />
                  </g>
                  <g fill="var(--color-accent)" fillOpacity="0.55">
                    <circle cx="24" cy="22" r="6" />
                    <circle cx="24" cy="55" r="6" />
                    <circle cx="24" cy="88" r="6" />
                    <circle cx="254" cy="30" r="6" />
                    <circle cx="254" cy="80" r="6" />
                  </g>
                  <circle
                    cx="136"
                    cy="55"
                    r="24"
                    fill="var(--color-accent)"
                    fillOpacity="0.14"
                    stroke="var(--color-accent)"
                    strokeWidth="1.25"
                  />
                  <circle cx="136" cy="55" r="7" fill="var(--color-accent)" />
                </svg>
              </article>
            </Reveal>

            {/* Cell 2 - quiet panel with the escalation ladder drawn in CSS */}
            <Reveal delay={70} className="lg:col-span-3">
              <article className="panel flex h-full flex-col p-7 md:p-8">
                <p className="meta">{FEATURES[1].kicker}</p>
                <h3 className="display mt-4 text-[clamp(1.15rem,1.6vw,1.4rem)]">
                  {FEATURES[1].title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-[var(--color-body)]">
                  {FEATURES[1].body}
                </p>
                <ul className="chain mt-auto pt-7">
                  {FEATURES[1].ladder?.map((l, i) => (
                    <li key={l}>
                      <span className="meta">{l}</span>
                      <span className="meta ml-3 text-[var(--color-ink)]">
                        {i === 0 ? 'after 30 minutes' : i === 1 ? 'after 2 hours' : 'at the deadline'}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            {/* Cell 3 - tinted panel with an integration list */}
            <Reveal delay={110} className="lg:col-span-2">
              <article className="tint-soft flex h-full flex-col p-7">
                <p className="meta">{FEATURES[2].kicker}</p>
                <h3 className="display mt-4 text-[clamp(1.05rem,1.4vw,1.25rem)]">
                  {FEATURES[2].title}
                </h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-[var(--color-body)]">
                  {FEATURES[2].body}
                </p>
                <ul className="mt-auto space-y-2.5 pt-7">
                  {FEATURES[2].channels?.map((c) => (
                    <li key={c} className="meta flex items-center gap-2.5">
                      <span className="tick" />
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            {/* Cell 4 - real photograph */}
            <Reveal delay={60} className="lg:col-span-2">
              <article className="panel flex h-full flex-col overflow-hidden">
                <div className="frame aspect-5/4 w-full border-0 border-b">
                  <img
                    src="https://picsum.photos/seed/relay-cool-41/1000/800"
                    alt="Curved glass office towers meeting at a corner, shot from below"
                    loading="lazy"
                    width={1000}
                    height={800}
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="meta">{FEATURES[3].kicker}</p>
                  <h3 className="display mt-4 text-[clamp(1.05rem,1.4vw,1.25rem)]">
                    {FEATURES[3].title}
                  </h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-[var(--color-body)]">
                    {FEATURES[3].body}
                  </p>
                </div>
              </article>
            </Reveal>

            {/* Cell 5 - striped ground with two readouts */}
            <Reveal delay={130} className="lg:col-span-2">
              <article className="pattern-stripe flex h-full flex-col p-7">
                <p className="meta">{FEATURES[4].kicker}</p>
                <h3 className="display mt-4 text-[clamp(1.05rem,1.4vw,1.25rem)]">
                  {FEATURES[4].title}
                </h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-[var(--color-body)]">
                  {FEATURES[4].body}
                </p>
                <dl className="mt-auto space-y-4 pt-7">
                  {FEATURES[4].stats?.map((s) => (
                    <div key={s.k}>
                      <dt className="meta">{s.k}</dt>
                      <dd className="mt-1 font-display text-[1.375rem] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* WORKFLOW - stepper on a rail, not three equal text cards        */}
        {/* -------------------------------------------------------------- */}
        <section
          id="how-it-works"
          className="border-y border-[var(--color-hairline)] bg-[var(--color-surface)] py-24 md:py-28"
        >
          <div className="shell">
            <Reveal>
              <SectionHead
                kicker="How it works"
                title="Four weeks from first call to a team running it"
                body="One queue at a time, with a month of live data before you commit to replacing anything."
              />
            </Reveal>

            <div className="relative mt-16">
              <div className="rail hidden md:block" aria-hidden="true" />
              <div className="rail-v md:hidden" aria-hidden="true" />

              <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
                {STEPS.map((s, i) => (
                  <Reveal key={s.n} delay={i * 90}>
                    <li className="relative pl-14 md:pl-0">
                      <span
                        className={`node absolute left-0 top-0 md:static ${
                          i === 1 ? 'node-on' : ''
                        }`}
                      >
                        {s.n}
                      </span>
                      <p className="meta md:mt-7">{s.when}</p>
                      <h3 className="display mt-3 text-[clamp(1.05rem,1.5vw,1.3rem)]">
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-[var(--color-body)]">
                        {s.body}
                      </p>
                      <p className="mt-5 border-t border-[var(--color-hairline)] pt-4 text-[0.8125rem] text-[var(--color-mute)] md:max-w-[34ch]">
                        {s.out}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* PRICING - two cards, real tiers and real feature lists          */}
        {/* -------------------------------------------------------------- */}
        <section id="pricing" className="shell py-24 md:py-28">
          <Reveal>
            <SectionHead
              title="Two plans, priced per seat"
              body="Both plans include the web app, the audit history shown in your plan, and every integration at no extra cost."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <article
                  className={`panel flex h-full flex-col p-7 md:p-9 ${
                    i === 1 ? 'border-[var(--color-accent)]' : ''
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="display text-[1.25rem]">{t.name}</h3>
                    <p className="meta">
                      {i === 0 ? 'Up to 12 seats' : 'Unlimited seats'}
                    </p>
                  </div>

                  <p className="mt-7 flex items-baseline gap-2">
                    <span className="font-display text-[clamp(2.4rem,4vw,3.1rem)] font-semibold leading-none tracking-[-0.04em] text-[var(--color-ink)]">
                      {t.price}
                    </span>
                    <span className="meta">{t.unit}</span>
                  </p>
                  <p className="mt-4 text-[0.875rem] leading-relaxed text-[var(--color-body)]">
                    {t.note}
                  </p>

                  <ul className="mt-8 space-y-3.5">
                    {t.features.map((f) => (
                      <li
                        key={f}
                        className="flex gap-3 text-[0.9375rem] leading-relaxed text-[var(--color-body)]"
                      >
                        <span className="tick" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-9 pt-1">
                    <a
                      href="#cta"
                      className={i === 1 ? 'btn btn-primary w-full' : 'btn btn-secondary w-full'}
                    >
                      Request a demo
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* FAQ - native accordion, six questions                          */}
        {/* -------------------------------------------------------------- */}
        <section id="questions" className="border-t border-[var(--color-hairline)] py-24 md:py-28">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <h2 className="display display-md">Questions we get before the first call</h2>
                <p className="lede mt-6">
                  If yours is not here, ask it on the call and you will get a straight
                  answer.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <div className="border-b border-[var(--color-hairline)]">
                {FAQS.map((f, i) => (
                  <Reveal key={f.q} delay={i * 50}>
                    <details className="border-t border-[var(--color-hairline)]" open={i === 0}>
                      <summary className="faq-q">
                        {f.q}
                        <span className="faq-plus" aria-hidden="true" />
                      </summary>
                      <p className="max-w-[62ch] pb-6 text-[0.9375rem] leading-relaxed text-[var(--color-body)]">
                        {f.a}
                      </p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CTA - closing band, one label, matching nav and hero           */}
        {/* -------------------------------------------------------------- */}
        <section id="cta" className="border-t border-[var(--color-hairline)] py-24 md:py-28">
          <div className="shell">
            <Reveal>
              <div className="border border-[var(--color-hairline)] bg-[var(--color-surface)] px-7 py-16 md:px-16 md:py-20">
                <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className="lg:col-span-7">
                    <h2 className="display display-lg">
                      Put a name on the next handover.
                    </h2>
                    <p className="lede mt-6">
                      Send us one queue you lose work in. We will come back with the
                      routing rules before the call ends.
                    </p>
                  </div>
                  <div className="lg:col-span-5">
                    <a href="#pricing" className="btn btn-primary w-full md:w-auto">
                      Request a demo
                    </a>
                    <p className="meta mt-4">
                      Thirty minutes, no slide deck. We look at your own queues.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-[var(--color-hairline)] py-12">
        <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="text-[var(--color-accent)]">
              <path
                d="M3.5 3.5h13v13h-13z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path d="M3.5 10h13" fill="none" stroke="currentColor" strokeWidth="1.75" />
            </svg>
            <span className="font-display text-[0.9375rem] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
              Relay
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {['Platform', 'How it works', 'Pricing', 'Questions'].map((i) => (
              <a
                key={i}
                href={`#${i.toLowerCase().replace(/ /g, '-')}`}
                className="text-[0.875rem] text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]"
              >
                {i}
              </a>
            ))}
          </nav>
          <p className="meta">Relay Software, remote team</p>
        </div>
      </footer>
    </>
  )
}