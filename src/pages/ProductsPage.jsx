import { useEffect, useMemo, useState } from 'react'
import { getCatalogue, getCategories } from '../api/inventoryApi'
import AsyncMediaImage from '../components/AsyncMediaImage'

function toProductList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.result)) return payload.result
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

function formatPrice(price) {
  if (!Number.isFinite(price)) return 'Price on request'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

function normalizeStockStatus(item, stockValue) {
  const rawStatus =
    item?.stockStatus ??
    item?.status ??
    item?.inventoryStatus ??
    item?.availabilityStatus ??
    ''

  if (typeof rawStatus === 'string' && rawStatus.trim()) {
    return rawStatus.trim()
  }

  if (Number.isFinite(stockValue)) {
    if (stockValue <= 0) return 'Out of Stock'
    if (stockValue <= 10) return 'Low Stock'
    return 'In Stock'
  }

  return 'Available'
}

function getStockRibbonClasses(status) {
  const normalized = status.toLowerCase()

  if (normalized.includes('out')) {
    return 'bg-red-600 text-white'
  }

  if (normalized.includes('low')) {
    return 'bg-amber-400 text-slate-900'
  }

  if (normalized.includes('in')) {
    return 'bg-emerald-500 text-white'
  }

  return 'bg-sky-700 text-white'
}

function buildCategoryLookup(payload) {
  const list =
    Array.isArray(payload) ? payload :
      Array.isArray(payload?.data) ? payload.data :
        Array.isArray(payload?.items) ? payload.items :
          Array.isArray(payload?.result) ? payload.result : []

  const lookup = new Map()
  list.forEach((category, index) => {
    const id = category?.id ?? category?.categoryId ?? index
    const name = category?.name ?? category?.categoryName ?? category?.title ?? null
    if (name) {
      lookup.set(String(id), name)
    }
  })

  return lookup
}

function mapProduct(item, index, categoryLookup) {
  const name =
    item?.name ??
    item?.productName ??
    item?.title ??
    `Product ${index + 1}`

  const description =
    item?.description ??
    item?.shortDescription ??
    item?.details ??
    `Explore ${name.toLowerCase()} and compare catalogue options for your business.`

  const rawPrice =
    item?.price ??
    item?.sellingPrice ??
    item?.unitPrice ??
    item?.mrp

  const parsedPrice = Number.parseFloat(rawPrice)
  const stockValue = Number.parseFloat(
    item?.quantityInStock ??
    item?.stock ??
    item?.availableQuantity,
  )
  const categoryId = item?.categoryId ?? item?.category?.id ?? item?.categoryID
  const categoryName =
    item?.categoryName ??
    item?.categoryTitle ??
    item?.category?.name ??
    item?.category?.title ??
    item?.category ??
    (categoryId !== undefined && categoryId !== null ? categoryLookup.get(String(categoryId)) : null) ??
    'Uncategorized'

  return {
    id: item?.id ?? item?.productId ?? item?.sku ?? `${name}-${index}`,
    name,
    description,
    categoryId,
    categoryName,
    price: Number.isFinite(parsedPrice) ? parsedPrice : null,
    priceText: formatPrice(parsedPrice),
    stock: Number.isFinite(stockValue) ? stockValue : null,
    stockStatus: normalizeStockStatus(item, stockValue),
    mediaSource:
      item?.imagePath ??
      item?.imageUrl ??
      item?.image ??
      item?.thumbnail ??
      item?.mediaPath ??
      null,
  }
}

function ProductsPage({ hasAccessToken = false }) {
  const [products, setProducts] = useState([])
  const [categoryLookup, setCategoryLookup] = useState(() => new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name-asc')

  useEffect(() => {
    let isMounted = true

    async function fetchProducts() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [catalogueData, categoriesData] = await Promise.all([
          getCatalogue(),
          getCategories(),
        ])
        if (!isMounted) return

        const list = toProductList(catalogueData)
        setProducts(list)
        setCategoryLookup(buildCategoryLookup(categoriesData))
      } catch (error) {
        if (!isMounted) return
        setErrorMessage(error?.response?.data?.message ?? 'Unable to load products right now.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [hasAccessToken])

  const displayProducts = useMemo(() => products.map((item, index) => mapProduct(item, index, categoryLookup)), [products, categoryLookup])

  const availableCategories = useMemo(() => {
    const categorySet = new Set(displayProducts.map((product) => product.categoryName))
    return ['All', ...Array.from(categorySet).sort((a, b) => a.localeCompare(b))]
  }, [displayProducts])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase()

    const filtered = displayProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.categoryName === selectedCategory
      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesSearch
    })

    const sorted = [...filtered]
    if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === 'price-low-high') {
      sorted.sort((a, b) => {
        const left = a.price ?? Number.POSITIVE_INFINITY
        const right = b.price ?? Number.POSITIVE_INFINITY
        return left - right
      })
    } else if (sortBy === 'price-high-low') {
      sorted.sort((a, b) => {
        const left = a.price ?? Number.NEGATIVE_INFINITY
        const right = b.price ?? Number.NEGATIVE_INFINITY
        return right - left
      })
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }

    return sorted
  }, [displayProducts, searchText, selectedCategory, sortBy])

  return (
    <div className="w-full px-4 py-8 sm:px-6 md:px-10 md:py-10">
      <section className="mx-auto w-full max-w-[1600px]">
        <h1 className="m-0 text-3xl font-semibold text-slate-900 sm:text-4xl">Products</h1>

        {isLoading && (
          <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
            Loading products...
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && displayProducts.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-600">
            No products available right now.
          </div>
        )}

        {!isLoading && !errorMessage && displayProducts.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
              <h2 className="m-0 text-lg font-semibold text-slate-900">Filters</h2>

              <div className="mt-4 grid gap-1.5">
                <label htmlFor="product-search" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Search
                </label>
                <input
                  id="product-search"
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search products"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                />
              </div>

              <div className="mt-4 grid gap-1.5">
                <label htmlFor="product-category" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </label>
                <select
                  id="product-category"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                >
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 grid gap-1.5">
                <label htmlFor="product-sort" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sort
                </label>
                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-low-high">Price Low to High</option>
                  <option value="price-high-low">Price High to Low</option>
                </select>
              </div>
            </aside>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="m-0 text-sm font-medium text-slate-600">
                  Showing {filteredProducts.length} products
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-600">
                  No products match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200">
                        <span className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm ${getStockRibbonClasses(product.stockStatus)}`}>
                          {product.stockStatus}
                        </span>

                        {product.mediaSource ? (
                          <AsyncMediaImage
                            source={product.mediaSource}
                            alt={product.name}
                            className="h-full w-full"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl text-slate-500" aria-hidden="true">
                            📦
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-sky-700">{product.categoryName}</p>
                        <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">{product.name}</h2>
                        <p className="mb-4 mt-2 min-h-[52px] text-sm leading-6 text-slate-600">{product.description}</p>

                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="m-0 text-lg font-bold text-slate-900">{product.priceText}</p>
                            {product.stock !== null && product.stock !== undefined && (
                              <p className="m-0 mt-0.5 text-xs text-slate-500">Stock: {product.stock}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-red-700"
                          >
                            Explore
                            <span aria-hidden="true">→</span>
                          </button>
                        </div>
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

export default ProductsPage
