import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Header({
  hasAccessToken,
  onLoginClick,
  onLogout,
  companyData = {},
  contactData = {},
  socialLinks = [],
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const staticNavLinks = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const {
    name = 'CataView',
    tagline = 'Fast Food & Restaurant',
    logoUrl = null,
    brandMarkText = 'CV',
  } = companyData

  const {
    phone = '+1 (800) 123-4567',
    email = 'hello@cataview.com',
    addressLine1 = '42 Flavor Street',
    city = 'NY',
  } = contactData

  const safeSocialLinks = Array.isArray(socialLinks) ? socialLinks : []

  const renderSocialIcon = (platform) => {
    const icons = {
      facebook: 'f',
      instagram: 'ig',
      twitter: 't',
      youtube: 'yt',
    }
    return icons[platform?.toLowerCase()] || platform?.charAt(0)
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((previous) => !previous)
  }

  return (
    <>
      <header className="w-full border-b border-slate-200">
        <div className="bg-[#0a0d14] px-4 py-2 text-[11px] text-slate-300 sm:px-6 md:px-10 md:text-xs">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-400">📞</span>
                {phone}
              </span>
              <span className="inline-flex items-center gap-2 break-all sm:break-normal">
                <span className="text-amber-400">✉</span>
                {email}
              </span>
              <span className="hidden items-center gap-2 md:inline-flex">
                <span className="text-amber-400">📍</span>
                {addressLine1}, {city}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 md:flex">
                {safeSocialLinks.length > 0 ? (
                  safeSocialLinks.map((social, idx) => (
                    <a
                      key={`social-${idx}`}
                      href={social?.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-7 place-items-center rounded-full bg-slate-800 text-[10px] text-slate-300 transition hover:bg-slate-700"
                      title={social?.platform || 'Social'}
                    >
                      {renderSocialIcon(social?.platform)}
                    </a>
                  ))
                ) : (
                  <>
                    <span className="grid size-7 place-items-center rounded-full bg-slate-800 text-[10px] text-slate-300">f</span>
                    <span className="grid size-7 place-items-center rounded-full bg-slate-800 text-[10px] text-slate-300">ig</span>
                    <span className="grid size-7 place-items-center rounded-full bg-slate-800 text-[10px] text-slate-300">t</span>
                    <span className="grid size-7 place-items-center rounded-full bg-slate-800 text-[10px] text-slate-300">yt</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f8f8f8] px-4 py-3 sm:px-6 md:px-10">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 sm:gap-3 lg:gap-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="grid size-9 place-items-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:text-slate-900 lg:hidden"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-header-sidebar"
                aria-label="Toggle menu"
                onClick={toggleMobileMenu}
              >
                <span className="text-lg leading-none">☰</span>
              </button>

              <NavLink to="/" className="flex min-w-0 items-center gap-2.5 no-underline sm:gap-3" onClick={closeMobileMenu}>
                {logoUrl ? (
                  <img src={logoUrl} alt={name} className="size-10 rounded-full object-cover sm:size-11" />
                ) : (
                  <div
                    className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-red-600 text-sm font-extrabold text-white sm:size-11"
                    aria-hidden="true"
                  >
                    {brandMarkText}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="m-0 truncate text-[1.25rem] font-black leading-none text-slate-900 sm:text-[1.45rem] lg:text-[1.6rem]">{name}</p>
                  <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.14em] text-slate-400 sm:text-[9px] sm:tracking-[0.2em] lg:text-[10px] lg:tracking-[0.3em]">{tagline}</p>
                </div>
              </NavLink>
            </div>

            <nav className="hidden w-auto items-center gap-4 lg:flex" aria-label="Primary">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-semibold leading-none transition xl:text-base ${isActive ? 'text-red-600' : 'text-slate-700 hover:text-red-600'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `text-sm font-semibold leading-none transition xl:text-base ${isActive ? 'text-red-600' : 'text-slate-700 hover:text-red-600'}`
                }
              >
                Categories
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `text-sm font-semibold leading-none transition xl:text-base ${isActive ? 'text-red-600' : 'text-slate-700 hover:text-red-600'}`
                }
              >
                Products
              </NavLink>
              {staticNavLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold leading-none transition xl:text-base ${isActive ? 'text-red-600' : 'text-slate-700 hover:text-red-600'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-base text-slate-600 transition hover:text-red-600"
                aria-label="Search"
              >
                🔍
              </button>

              {hasAccessToken ? (
                <button
                  type="button"
                  className="hidden items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 sm:px-4 sm:text-base lg:inline-flex"
                  onClick={onLogout}
                  title="Logout"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-red-700 text-xs">U</span>
                  Account
                </button>
              ) : (
                <button
                  type="button"
                  className="hidden rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 sm:px-5 sm:text-base lg:inline-block"
                  onClick={onLoginClick}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-900/45 transition ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'} lg:hidden`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside
        id="mobile-header-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-[82%] max-w-[320px] border-r border-slate-200 bg-white p-5 shadow-2xl transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="m-0 text-lg font-bold text-slate-900">Menu</p>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-slate-300 text-slate-700"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="grid gap-1" aria-label="Mobile primary">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/categories"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/products"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`
            }
          >
            Products
          </NavLink>
          {staticNavLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-200 pt-4">
          {hasAccessToken ? (
            <button
              type="button"
              className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              onClick={() => {
                onLogout()
                closeMobileMenu()
              }}
            >
              Account
            </button>
          ) : (
            <button
              type="button"
              className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              onClick={() => {
                onLoginClick()
                closeMobileMenu()
              }}
            >
              Login
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

export default Header
