import { Link } from 'react-router-dom'

const fallbackCategories = [
  {
    name: 'Fresh Fruits',
    tag: 'Seasonal',
    description: 'Hand-picked premium fruits with consistent quality and freshness.',
    icon: '🍊',
    accent: 'from-amber-400/20 via-orange-400/10 to-transparent',
  },
  {
    name: 'Vegetables',
    tag: 'Farm Direct',
    description: 'Daily sourced greens and essentials for high-volume kitchen prep.',
    icon: '🥬',
    accent: 'from-emerald-400/20 via-teal-400/10 to-transparent',
  },
  {
    name: 'Dairy & Eggs',
    tag: 'Best Seller',
    description: 'Reliable dairy and egg supply for cafes, restaurants, and bakeries.',
    icon: '🥛',
    accent: 'from-sky-400/20 via-blue-400/10 to-transparent',
  },
  {
    name: 'Bakery Goods',
    tag: 'Hot Pick',
    description: 'Bread, buns, and baked staples curated for food service teams.',
    icon: '🥖',
    accent: 'from-rose-400/20 via-red-400/10 to-transparent',
  },
]

function TopCategoriesSection({ categories = [], isLoading = false, errorMessage = '' }) {
  const displayCategories = (categories.length > 0 ? categories : fallbackCategories).slice(0, 3)

  return (
    <section className="mt-4 w-full px-3 pb-1 sm:px-4 md:px-6 lg:px-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Top Categories</p>
          <h2 className="mt-1 mb-0 text-2xl font-semibold text-slate-900 sm:text-[1.75rem] md:text-3xl">Shop by Popular Groups</h2>
        </div>
        <Link
          to="/categories"
          className="shrink-0 text-sm font-semibold text-sky-700 underline-offset-2 hover:underline sm:rounded-lg sm:border sm:border-slate-300 sm:bg-white sm:px-3 sm:py-2 sm:no-underline sm:text-slate-700 sm:transition sm:hover:border-slate-400 sm:hover:text-slate-900"
        >
          View all
        </Link>
      </div>

      {isLoading && (
        <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
          Loading top 3 categories...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {displayCategories.map((category) => (
          <article
            key={category.id ?? category.name}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${category.accent}`} aria-hidden="true" />

            <div className="relative p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="text-2xl" aria-hidden="true">
                  {category.icon}
                </span>
              </div>

              <h3 className="m-0 text-lg font-semibold text-slate-900 sm:text-xl">{category.name}</h3>
              <p className="mt-2 mb-4 min-h-[52px] text-sm leading-6 text-slate-600">{category.description}</p>

              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-red-700"
              >
                Explore
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TopCategoriesSection
