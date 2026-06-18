import heroImg from '../assets/hero.png'
import { Link } from 'react-router-dom'

function HeroSection({ data = {} }) {
  const {
    eyebrow = 'Inventory Experience',
    title = 'Find the right catalogue in seconds',
    subtitle = 'Explore categories and products with a modern storefront experience.',
    imageUrl = null,
    primaryCta = { label: 'Browse Categories', path: '/categories' },
    secondaryCta = { label: 'View Products', path: '/products' },
  } = data

  const displayImage = imageUrl || heroImg

  return (
    <section className="mt-3 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="relative mx-auto grid w-full max-w-[1600px] overflow-hidden rounded-2xl border border-sky-900/40 bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 shadow-[0_22px_55px_-30px_rgba(2,6,23,0.95)] sm:rounded-3xl md:min-h-[380px] md:grid-cols-[1.1fr_0.9fr] md:items-center lg:min-h-[430px]">
        <div className="pointer-events-none absolute -right-16 -top-12 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col justify-center p-4 text-slate-200 sm:p-6 md:p-7 lg:p-10">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">{eyebrow}</p>
          <h1 className="mt-2 text-[1.6rem] font-extrabold leading-[1.1] text-white sm:text-[2rem] md:max-w-[20ch] md:text-[2.35rem] lg:text-[2.6rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-[15px] md:text-base">
            {subtitle}
          </p>

          <div className="mt-5 hidden gap-2.5 sm:flex-row sm:flex-wrap lg:flex">
            <Link
              to={primaryCta?.path ?? '/categories'}
              className="rounded-xl bg-cyan-300 px-4 py-2.5 text-center text-sm font-semibold text-sky-950 transition hover:bg-cyan-200"
            >
              {primaryCta?.label ?? 'Browse Categories'}
            </Link>
            <Link
              to={secondaryCta?.path ?? '/products'}
              className="rounded-xl border border-slate-300/50 px-4 py-2.5 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-200/10"
            >
              {secondaryCta?.label ?? 'View Products'}
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-[380px] items-center justify-center px-6 pb-0 md:flex md:min-h-[380px] lg:min-h-[430px]">
          <div className="absolute inset-0 bg-radial-[at_58%_45%] from-cyan-300/20 to-transparent to-65%" aria-hidden="true" />
          <img
            src={displayImage}
            alt="CataView product showcase"
            className="relative h-auto w-full max-w-[240px] object-contain opacity-90 drop-shadow-2xl sm:max-w-[300px] md:max-w-[400px] lg:max-w-[480px]"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
