import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCatalogue, getCatalogueById } from '../api/inventoryApi'
import AsyncMediaImage from '../components/AsyncMediaImage'

function toProductList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.items)) return payload.data.items
  if (Array.isArray(payload?.data?.result)) return payload.data.result
  if (Array.isArray(payload?.data?.products)) return payload.data.products
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.result)) return payload.result
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

function toComparableId(value) {
  return String(value ?? '').trim().toLowerCase()
}

function mapRelatedProduct(item, index) {
  const parsedPrice = Number.parseFloat(item?.price)

  return {
    id: item?.id ?? item?.productId ?? `${item?.name ?? 'product'}-${index}`,
    name: item?.name ?? `Product ${index + 1}`,
    description:
      item?.shortDescription ??
      item?.description ??
      'Explore this product in detail.',
    priceText: formatPrice(parsedPrice),
    mediaSource: item?.photoUrl ?? item?.imagePath ?? item?.image ?? item?.thumbnail ?? null,
  }
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

function getStockBadgeClass(status) {
  const normalized = String(status ?? '').toLowerCase()

  if (normalized.includes('out')) {
    return 'bg-red-100 text-red-700 border-red-200'
  }

  if (normalized.includes('low')) {
    return 'bg-amber-100 text-amber-700 border-amber-200'
  }

  if (normalized.includes('in')) {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }

  return 'bg-sky-100 text-sky-700 border-sky-200'
}

function sanitizeProductHtml(html) {
  if (typeof html !== 'string') return ''

  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}

function mapProduct(item) {
  const parsedPrice = Number.parseFloat(item?.price)
  const parsedStockQty = Number.parseFloat(item?.stockQty)

  return {
    id: item?.id ?? null,
    name: item?.name ?? 'Product',
    description: item?.shortDescription ?? 'No short description available.',
    longDescriptionHtml: sanitizeProductHtml(item?.longDescription),
    priceText: formatPrice(parsedPrice),
    stockQty: Number.isFinite(parsedStockQty) ? parsedStockQty : null,
    stockStatus: item?.stockStatus ?? 'Available',
    mediaSource: item?.photoUrl ?? null,
    restockDate: item?.restockDate ?? null,
  }
}

function ProductDetailSkeleton() {
  return (
    <section className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-6">
      <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
      <div className="space-y-3">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-44 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-16 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-16 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    </section>
  )
}

function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchProductDetail() {
      setIsLoading(true)
      setErrorMessage('')
      setRelatedProducts([])

      if (!productId) {
        setErrorMessage('Product id is missing.')
        setIsLoading(false)
        return
      }

      try {
        const detailPayload = await getCatalogueById(productId)
        const detail = detailPayload?.data ?? detailPayload

        if (!isMounted) return

        if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
          setErrorMessage('Product not found.')
          setProduct(null)
          return
        }

        setProduct(mapProduct(detail))

        try {
          const categoryId =
            detail?.categoryId ??
            detail?.categoryID ??
            detail?.category?.id ??
            detail?.category?.categoryId ??
            null

          if (categoryId === null || categoryId === undefined || String(categoryId).trim() === '') {
            setRelatedProducts([])
            return
          }

          const cataloguePayload = await getCatalogue({ categoryId })
          const catalogueList = toProductList(cataloguePayload)
          const currentId = toComparableId(detail?.id ?? productId)

          const related = catalogueList
            .filter((item) => toComparableId(item?.id ?? item?.productId) !== currentId)
            .map(mapRelatedProduct)
            .slice(0, 8)

          setRelatedProducts(related)
        } catch {
          setRelatedProducts([])
        }
      } catch (error) {
        if (!isMounted) return
        setErrorMessage(error?.response?.data?.message ?? 'Unable to load product details right now.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProductDetail()

    return () => {
      isMounted = false
    }
  }, [productId])

  const facts = product
    ? [
      { label: 'Stock', value: product.stockQty },
      { label: 'Restock Date', value: product.restockDate },
    ].filter((fact) => fact.value !== null && fact.value !== undefined && String(fact.value).trim() !== '')
    : []

  return (
    <div className="w-full px-4 py-8 sm:px-6 md:px-10 md:py-10">
      <section className="mx-auto w-full max-w-[1200px]">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          <span aria-hidden="true">←</span>
          Back to products
        </Link>

        {isLoading && <ProductDetailSkeleton />}

        {!isLoading && errorMessage && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && product && (
          <>
            <section className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-6">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {product.mediaSource ? (
                  <AsyncMediaImage source={product.mediaSource} alt={product.name} className="h-72 w-full sm:h-[360px]" />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-6xl sm:h-[360px]" aria-hidden="true">
                    📦
                  </div>
                )}
              </div>

              <div>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{product.name}</h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="m-0 text-2xl font-bold text-slate-900">{product.priceText}</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStockBadgeClass(product.stockStatus)}`}>
                    {product.stockStatus}
                  </span>
                </div>

                {facts.length > 0 && (
                  <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {facts.map((fact) => (
                      <div key={fact.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{fact.label}</dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {product.longDescriptionHtml ? (
                  <div
                    className="mt-3 text-sm leading-7 text-slate-700 sm:text-base [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: product.longDescriptionHtml }}
                  />
                ) : (
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{product.description}</p>
                )}
              </div>
            </section>

            {relatedProducts.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Related Products</h2>
                <p className="mt-1 text-sm text-slate-600">More products from the same category</p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedProducts.map((related) => (
                    <article key={related.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="overflow-hidden border-b border-slate-200 bg-slate-50">
                        {related.mediaSource ? (
                          <AsyncMediaImage source={related.mediaSource} alt={related.name} className="h-40 w-full" />
                        ) : (
                          <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-4xl" aria-hidden="true">
                            📦
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{related.name}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{related.description}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{related.priceText}</p>
                        <Link
                          to={`/products/${related.id}`}
                          className="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          View details
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default ProductDetailPage