import { api, setTokensFromAuthResponse } from './axiosClient'
import { endpoints } from './endpoints'

export async function login(credentials) {
  const response = await api.post(endpoints.login, credentials)
  return setTokensFromAuthResponse(response.data)
}

export async function registerAccount(payload) {
  const response = await api.post(endpoints.register, payload)

  if (response.data?.accessToken || response.data?.token || response.data?.jwtToken) {
    return setTokensFromAuthResponse(response.data)
  }

  return response.data
}

export async function getCategories(params) {
  const response = await api.get(endpoints.categories, { params })
  return response.data
}

export async function getPublicInfo() {
  const response = await api.get(endpoints.publicInfo)
  return response.data
}

export async function getCatalogue() {
  const response = await api.get(endpoints.catalogue)
  return response.data
}

export async function getPublicMediaBlob(path, signal) {
  const response = await api.get(endpoints.media, {
    params: { path },
    responseType: 'blob',
    signal,
  })

  return response.data
}
