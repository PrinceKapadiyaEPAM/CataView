import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/inventoryApi'
import AsyncMediaImage from '../components/AsyncMediaImage'

const categoryStyles = [
  { icon: '🍊', accent: 'from-amber-400/25 via-orange-400/10 to-transparent', tag: 'Seasonal' },
  { icon: '🥬', accent: 'from-emerald-400/25 via-teal-400/10 to-transparent', tag: 'Farm Direct' },
  { icon: '🥛', accent: 'from-sky-400/25 via-blue-400/10 to-transparent', tag: 'Best Seller' },
  { icon: '🥖', accent: 'from-rose-400/25 via-red-400/10 to-transparent', tag: 'Hot Pick' },
]

function toCategoryList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.result)) return payload.result
  return []
}

function mapCategory(item, index) {
  const style = categoryStyles[index % categoryStyles.length]
  const name =
    item?.name ??
    item?.categoryName ??
    item?.title ??
    `Category ${index + 1}`

  const description =
    item?.description ??
    item?.details ??
    `Explore products from ${name.toLowerCase()} curated for your storefront.`

  return {
    id: item?.id ?? item?.categoryId ?? name,
    name,
    description,
    mediaSource:
      item?.imagePath ??
      item?.imageUrl ??
      item?.image ??
      item?.thumbnail ??
      item?.mediaPath ??
      null,
    icon: style.icon,
    accent: style.accent,
    tag: style.tag,
  }
}

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')

  useEffect(() => {
    let isMounted = true

    async function fetchAllCategories() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const data = await getCategories()
        if (!isMounted) return

        const list = toCategoryList(data)
        setCategories(list)
      } catch (error) {
        if (!isMounted) return
        setErrorMessage(error?.response?.data?.message ?? 'Unable to load categories right now.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAllCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const displayCategories = useMemo(
    () => categories.map(mapCategory),
    [categories],
  )

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase()

    const filtered = displayCategories.filter((category) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        category.name.toLowerCase().includes(normalizedQuery) ||
        category.description.toLowerCase().includes(normalizedQuery)

      return matchesSearch
    })

    const sorted = [...filtered]
    if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name))
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }

    return sorted
  }, [displayCategories, searchText, sortBy])

  return (
    <div className="w-full px-4 py-8 sm:px-6 md:px-10 md:py-10">
      <section className="mx-auto w-full max-w-[1600px]">
        <h1 className="m-0 text-3xl font-semibold text-slate-900 sm:text-4xl">Categories</h1>

        {isLoading && (
          <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
            Loading categories...
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && displayCategories.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-600">
            No categories available right now.
          </div>
        )}

        {!isLoading && !errorMessage && displayCategories.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
              <h2 className="m-0 text-lg font-semibold text-slate-900">Filters</h2>

              <div className="mt-4 grid gap-1.5">
                <label htmlFor="category-search" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Search
                </label>
                <input
                  id="category-search"
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search categories"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                />
              </div>

              <div className="mt-4 grid gap-1.5">
                <label htmlFor="category-sort" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sort
                </label>
                <select
                  id="category-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>

            </aside>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="m-0 text-sm font-medium text-slate-600">
                  Showing {filteredCategories.length} categories
                </p>
              </div>

              {filteredCategories.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-600">
                  No categories match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCategories.map((category) => (
                    <article
                      key={category.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className={`relative h-40 bg-gradient-to-br ${category.accent}`}>
                        {category.mediaSource ? (
                          <AsyncMediaImage
                            source={category.mediaSource}
                            alt={category.name}
                            className="h-full w-full"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-5xl" aria-hidden="true">
                            {category.icon}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h2 className="m-0 text-lg font-semibold text-slate-900 sm:text-xl">{category.name}</h2>
                        <p className="mb-4 mt-2 min-h-[52px] text-sm leading-6 text-slate-600">{category.description}</p>

                        <Link
                          to={category.id ? `/products?id=${encodeURIComponent(category.id)}` : '/products'}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-red-700"
                        >
                          Explore
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default CategoriesPage
