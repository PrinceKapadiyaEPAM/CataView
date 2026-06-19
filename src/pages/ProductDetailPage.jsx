import { useEffect, useMemo, useState } from 'react'
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

function getStockBadgeClass(status) {
  const normalized = status.toLowerCase()

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

function toComparableId(value) {
  return String(value ?? '').trim().toLowerCase()
}

function pickProductById(list, productId) {
  const target = toComparableId(productId)
  if (!target) return null

  return (
    list.find((item) => toComparableId(item?.id) === target) ??
    list.find((item) => toComparableId(item?.productId) === target) ??
    list.find((item) => toComparableId(item?.sku) === target) ??
    null
  )
}

function mapProduct(item) {
  const name = item?.name ?? item?.productName ?? item?.title ?? 'Product'
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

  return {
    id: item?.id ?? item?.productId ?? item?.sku ?? name,
    name,
    description:
      item?.description ??
      item?.shortDescription ??
      item?.details ??
      `Discover pricing, availability, and details for ${name.toLowerCase()}.`,
    categoryName:
      item?.categoryName ??
      item?.categoryTitle ??
      item?.category?.name ??
      item?.category?.title ??
      item?.category ??
      'Uncategorized',
    priceText: formatPrice(parsedPrice),
    stock: Number.isFinite(stockValue) ? stockValue : null,
    stockStatus: normalizeStockStatus(item, stockValue),
    mediaSource:
      item?.imagePath ??
      item?.photoUrl ??
      item?.image ??
      item?.thumbnail ??
      item?.mediaPath ??
      null,
    sku: item?.sku ?? item?.productCode ?? item?.code ?? null,
    brand: item?.brand ?? item?.brandName ?? null,
    unit: item?.unit ?? item?.uom ?? item?.unitType ?? null,
    minimumOrder:
      item?.minimumOrderQuantity ??
      item?.minOrderQty ??
      item?.minOrder ??
      null,
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
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchProductDetail() {
      setIsLoading(true)
      setErrorMessage('')

      if (!productId) {
        setErrorMessage('Product id is missing.')
        setIsLoading(false)
        return
      }

      try {
        const detailPayload = await getCatalogueById(productId)

        let list = toProductList(detailPayload)
        let found = pickProductById(list, productId)

        if (!found && detailPayload && typeof detailPayload === 'object' && !Array.isArray(detailPayload)) {
          found = pickProductById([detailPayload, detailPayload?.data], productId)
        }

        // Fallback: if detail-like query does not return an exact match, search from a broader catalogue response.
        if (!found) {
          const cataloguePayload = await getCatalogue()
          list = toProductList(cataloguePayload)
          found = pickProductById(list, productId)
        }

        if (!isMounted) return

        if (!found) {
          setErrorMessage('Product not found.')
          setProduct(null)
          return
        }

        setProduct(mapProduct(found))
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

  const facts = useMemo(() => {
    if (!product) return []

    return [
      { label: 'Category', value: product.categoryName },
      { label: 'SKU', value: product.sku },
      { label: 'Brand', value: product.brand },
      { label: 'Unit', value: product.unit },
      { label: 'Min Order', value: product.minimumOrder },
      { label: 'Stock', value: product.stock },
    ].filter((fact) => fact.value !== null && fact.value !== undefined && String(fact.value).trim() !== '')
  }, [product])

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
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-sky-700">{product.categoryName}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{product.name}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{product.description}</p>

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
            </div>
          </section>
        )}
      </section>
    </div>
  )
}

export default ProductDetailPage