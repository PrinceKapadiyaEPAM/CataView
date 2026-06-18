const ACCESS_TOKEN_KEY = 'cataview_access_token'
const REFRESH_TOKEN_KEY = 'cataview_refresh_token'

export const tokenStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setAccessToken(token) {
    if (!token) return
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken(token) {
    if (!token) return
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  saveTokenPair({ accessToken, refreshToken }) {
    this.setAccessToken(accessToken)
    this.setRefreshToken(refreshToken)
  },
}
