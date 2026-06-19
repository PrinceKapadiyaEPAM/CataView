import { useEffect, useRef, useState } from 'react'
import { getPublicMediaBlob } from '../api/inventoryApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7200'

function normalizePath(path) {
  if (!path) return null
  const normalized = String(path).trim().replace(/\\/g, '/')
  if (!normalized) return null

  if (normalized.startsWith('/uploads/')) {
    return normalized
  }

  if (normalized.startsWith('uploads/')) {
    return `/${normalized}`
  }

  if (normalized.includes('/uploads/')) {
    const uploadsIndex = normalized.indexOf('/uploads/')
    return normalized.slice(uploadsIndex)
  }

  return null
}

function buildMediaUrl(path) {
  return `${API_BASE_URL}/api/public/media?path=${encodeURIComponent(path)}`
}

function extractMediaPath(source) {
  if (!source || typeof source !== 'string') return null

  const trimmed = source.trim()
  if (!trimmed) return null

  const normalizedFromRaw = normalizePath(trimmed)
  if (normalizedFromRaw) return normalizedFromRaw

  if (trimmed.includes('path=')) {
    try {
      const parsed = new URL(trimmed, window.location.origin)
      const queryPath = parsed.searchParams.get('path')
      return normalizePath(queryPath)
    } catch {
      return null
    }
  }

  return null
}

function AsyncMediaImage({ source, alt, className }) {
  const rootRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [resolvedSrc, setResolvedSrc] = useState('')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '220px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad || !source) return

    const mediaPath = extractMediaPath(source)

    // For non-media endpoint URLs, let browser load directly.
    if (!mediaPath) {
      setResolvedSrc(source)
      setStatus('loaded')
      return
    }

    let isMounted = true
    const controller = new AbortController()
    let objectUrl = ''

    async function load() {
      setStatus('loading')
      try {
        const blob = await getPublicMediaBlob(mediaPath, controller.signal)
        if (!isMounted) return
        objectUrl = URL.createObjectURL(blob)
        setResolvedSrc(objectUrl)
        setStatus('loaded')
      } catch (error) {
        if (!isMounted || error?.name === 'CanceledError' || error?.name === 'AbortError') {
          return
        }

        // Fallback to direct URL so images still render if blob fetch fails.
        setResolvedSrc(buildMediaUrl(mediaPath))
        setStatus('loaded')
      }
    }

    load()

    return () => {
      isMounted = false
      controller.abort()
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [shouldLoad, source])

  return (
    <div ref={rootRef} className={className}>
      {status === 'loaded' && resolvedSrc ? (
        <img src={resolvedSrc} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="h-full w-full animate-pulse bg-slate-200/70" aria-hidden="true" />
      )}
    </div>
  )
}

export default AsyncMediaImage
