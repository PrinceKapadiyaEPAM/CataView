import axios from 'axios'
import { endpoints } from './endpoints'
import { tokenStorage } from './tokenStorage'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7200'

export const api = axios.create({
  baseURL,
  timeout: 15000,
})

let isRefreshing = false
let refreshQueue = []

function queueRequest(resolve, reject) {
  refreshQueue.push({ resolve, reject })
}

function flushQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }

    resolve(token)
  })

  refreshQueue = []
}

function parseTokenPayload(data) {
  const accessToken =
    data?.accessToken ??
    data?.token ??
    data?.jwtToken ??
    data?.data?.accessToken

  const refreshToken =
    data?.refreshToken ??
    data?.data?.refreshToken ??
    tokenStorage.getRefreshToken()

  return { accessToken, refreshToken }
}

async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post(
    `${baseURL}${endpoints.refresh}`,
    { refreshToken },
    { timeout: 15000 },
  )

  const tokenPair = parseTokenPayload(response.data)

  if (!tokenPair.accessToken) {
    throw new Error('Refresh response did not include access token')
  }

  tokenStorage.saveTokenPair(tokenPair)
  return tokenPair.accessToken
}

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueRequest(resolve, reject)
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    isRefreshing = true

    try {
      const newAccessToken = await refreshAccessToken()
      flushQueue(null, newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      flushQueue(refreshError, null)
      tokenStorage.clearTokens()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export function setTokensFromAuthResponse(data) {
  const tokenPair = parseTokenPayload(data)
  tokenStorage.saveTokenPair(tokenPair)
  return tokenPair
}
