import { Link } from 'react-router-dom'

const fixedShopLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms & Conditions', path: '/terms' },
]

const fixedAccountLinks = [
  { label: 'My Account', path: '/account' },
  { label: 'Order History', path: '/orders' },
  { label: 'Wishlist', path: '/wishlist' },
]

const defaultPayments = ['VISA', 'MasterCard', 'PayPal']

// Helper to extract text from string or object
const getText = (item) => {
  if (typeof item === 'string') return item
  if (item?.label) return item.label
  if (item?.name) return item.name
  return String(item)
}

function Footer({ footerData = {}, companyData = {}, contactData = {} }) {
  const year = new Date().getFullYear()

  const {
    name: companyName = 'CataView',
    tagline: companyTagline = 'Fresh products'
  } = companyData
  
  const {
    aboutTitle = 'Why People Like Us!',
    aboutText = 'Reliable quality, fair pricing, and smooth ordering for restaurants and retailers.',
    newsletter = { placeholder: 'Your Email', buttonText: 'Subscribe Now' },
    payments = defaultPayments,
    copyrightText = `© CataView ${year}, All rights reserved.`
  } = footerData

  const {
    addressLine1 = '42 Flavor Street',
    city = 'NY',
    email = 'hello@cataview.com',
    mobile = '+1 (800) 123-4567'
  } = contactData

  // Ensure arrays are valid
  const safePayments = Array.isArray(payments) ? payments : defaultPayments

  return (
    <footer className="mt-8 w-full bg-slate-700 text-slate-200">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-9 sm:px-6 md:px-10">
        <div className="flex flex-col gap-5 border-b border-slate-500 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="m-0 text-3xl font-bold text-lime-400 sm:text-4xl">{companyName}</h2>
            <p className="mt-1 text-lg text-amber-400 sm:text-xl">{companyTagline}</p>
          </div>

          <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white sm:flex-row sm:rounded-full lg:w-[52%]">
            <input
              type="email"
              placeholder={newsletter.placeholder || 'Your Email'}
              className="w-full border-0 px-4 py-3 text-base text-slate-700 outline-none sm:px-5 sm:text-lg"
            />
            <button
              type="button"
              className="shrink-0 bg-lime-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-lime-600 sm:text-lg"
            >
              {newsletter.buttonText || 'Subscribe Now'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-full border border-amber-300 text-amber-300 sm:size-11">x</span>
            <span className="grid size-10 place-items-center rounded-full border border-amber-300 text-amber-300 sm:size-11">f</span>
            <span className="grid size-10 place-items-center rounded-full border border-amber-300 text-amber-300 sm:size-11">yt</span>
            <span className="grid size-10 place-items-center rounded-full border border-amber-300 text-amber-300 sm:size-11">in</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 xl:grid-cols-4">
          <section>
            <h3 className="m-0 text-xl font-semibold text-white sm:text-2xl">{aboutTitle}</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              {aboutText}
            </p>
            <button
              type="button"
              className="mt-5 rounded-full border border-lime-400 px-5 py-2.5 text-lg font-semibold text-lime-400 transition hover:bg-lime-400 hover:text-slate-900 sm:px-6 sm:text-xl"
            >
              Read More
            </button>
          </section>

          <section>
            <h3 className="m-0 text-xl font-semibold text-white sm:text-2xl">Shop Info</h3>
            <ul className="mt-4 space-y-2 text-base text-slate-300 sm:text-lg">
              {fixedShopLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="transition hover:text-lime-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="m-0 text-xl font-semibold text-white sm:text-2xl">Account</h3>
            <ul className="mt-4 space-y-2 text-base text-slate-300 sm:text-lg">
              {fixedAccountLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="transition hover:text-lime-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="m-0 text-xl font-semibold text-white sm:text-2xl">Contact</h3>
            <ul className="mt-4 space-y-2 break-words text-base text-slate-300 sm:text-lg">
              <li>Address: {addressLine1}, {city}</li>
              <li>Email: {email}</li>
              <li>Mobile: {mobile}</li>
              <li>Payments accepted</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {safePayments.map((payment, idx) => (
                <span key={`payment-${idx}`} className="rounded bg-slate-600 px-2 py-1 text-sm font-semibold sm:text-base">
                  {getText(payment)}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-500 pt-5 text-sm text-slate-300 sm:text-base md:flex-row md:items-center md:justify-between">
          <p className="m-0">{copyrightText}</p>
          <p className="m-0">
            Designed for <Link to="/" className="text-lime-400 underline">CataView</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
