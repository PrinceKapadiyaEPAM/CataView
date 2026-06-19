import { useEffect, useMemo, useState } from 'react'
import { getCategories, getPublicInfo } from '../api/inventoryApi'
import HeroSection from '../components/HeroSection'
import PlaceholderSection from '../components/PlaceholderSection'
import TopCategoriesSection from '../components/TopCategoriesSection'

const categoryStyles = [
  { icon: '🍊', accent: 'from-amber-400/20 via-orange-400/10 to-transparent', tag: 'Seasonal' },
  { icon: '🥬', accent: 'from-emerald-400/20 via-teal-400/10 to-transparent', tag: 'Farm Direct' },
  { icon: '🥛', accent: 'from-sky-400/20 via-blue-400/10 to-transparent', tag: 'Best Seller' },
  { icon: '🥖', accent: 'from-rose-400/20 via-red-400/10 to-transparent', tag: 'Hot Pick' },
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
    `Explore top picks from ${name.toLowerCase()} curated for your storefront.`

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
    accent: style.accent,
    tag: style.tag,
  }
}

function HomePage() {
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [publicInfo, setPublicInfo] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPublicInfo() {
      try {
        const data = await getPublicInfo()
        if (!isMounted) return
        setPublicInfo(data?.data || data)
      } catch (error) {
        if (!isMounted) return
        console.error('Failed to load public info:', error)
      }
    }

    async function fetchCategories() {
      setIsLoadingCategories(true)
      setCategoriesError('')

      try {
        const data = await getCategories({ limit: 3 })
        if (!isMounted) return

        const list = toCategoryList(data)
        setCategories(list)
      } catch (error) {
        if (!isMounted) return
        setCategoriesError(error?.response?.data?.message ?? 'Unable to load categories right now.')
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false)
        }
      }
    }

    fetchCategories()
    fetchPublicInfo()

    return () => {
      isMounted = false
    }
  }, [])

  const heroData = publicInfo?.hero || {
    eyebrow: 'Inventory Experience',
    title: 'Find the right catalogue in seconds',
    subtitle: 'Explore categories and products with a modern storefront experience.',
    imageUrl: null,
  }

  const topCategories = useMemo(
    () => categories.slice(0, 3).map(mapCategory),
    [categories],
  )

  return (
    <div className="w-full px-0 pb-8 sm:pb-10">
      <HeroSection data={heroData} />
      <TopCategoriesSection
        categories={topCategories}
        isLoading={isLoadingCategories}
        errorMessage={categoriesError}
      />

      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <PlaceholderSection
          id="products-home"
          title="Products"
          description="Discover available products and compare catalog entries in a clean full-width layout."
        />
      </div>
    </div>
  )
}

export default HomePage
