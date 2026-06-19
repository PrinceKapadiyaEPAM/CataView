import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { login, registerAccount, getPublicInfo } from './api/inventoryApi'
import { tokenStorage } from './api/tokenStorage'
import AuthModal from './components/AuthModal'
import Footer from './components/Footer'
import Header from './components/Header'
import AboutPage from './pages/AboutPage'
import CategoriesPage from './pages/CategoriesPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [publicInfo, setPublicInfo] = useState(null)
  const [hasAccessToken, setHasAccessToken] = useState(() => Boolean(tokenStorage.getAccessToken()))

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

    fetchPublicInfo()

    return () => {
      isMounted = false
    }
  }, [])

  function openLogin() {
    setAuthMode('login')
    setAuthMessage('')
    setIsAuthModalOpen(true)
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false)
  }

  function switchAuthMode(nextMode) {
    setAuthMode(nextMode)
    setAuthMessage('')
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setIsSubmittingAuth(true)
    setAuthMessage(authMode === 'login' ? 'Signing in...' : 'Creating account...')

    try {
      if (authMode === 'login') {
        const tokenPair = await login({ email, password })

        if (!tokenPair.accessToken) {
          setAuthMessage('Login succeeded but no access token was returned.')
          return
        }

        setHasAccessToken(true)
        setAuthMessage('Login successful.')
      } else {
        if (password !== confirmPassword) {
          setAuthMessage('Password and confirm password must match.')
          return
        }

        await registerAccount({
          fullName,
          email,
          password,
          confirmPassword,
        })

        setHasAccessToken(Boolean(tokenStorage.getAccessToken()))
        setAuthMessage('Registration successful. You can now continue.')
      }

      closeAuthModal()
    } catch (error) {
      setAuthMessage(error.response?.data?.message ?? error.message ?? 'Authentication request failed')
    } finally {
      setIsSubmittingAuth(false)
    }
  }

  function handleLogout() {
    tokenStorage.clearTokens()
    setHasAccessToken(false)
  }

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <Header
        hasAccessToken={hasAccessToken}
        onLoginClick={openLogin}
        onLogout={handleLogout}
        companyData={publicInfo?.company}
        contactData={publicInfo?.contact}
        socialLinks={publicInfo?.socialLinks}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage hasAccessToken={hasAccessToken} />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage companyData={publicInfo?.company} />} />
        <Route path="/contact" element={<ContactPage companyData={publicInfo?.company} contactData={publicInfo?.contact} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer
        footerData={publicInfo?.footer}
        companyData={publicInfo?.company}
        contactData={publicInfo?.contact}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        authMode={authMode}
        onModeChange={switchAuthMode}
        fullName={fullName}
        onFullNameChange={setFullName}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        confirmPassword={confirmPassword}
        onConfirmPasswordChange={setConfirmPassword}
        authMessage={authMessage}
        isSubmitting={isSubmittingAuth}
        onClose={closeAuthModal}
        onSubmit={handleAuthSubmit}
      />
    </main>
  )
}

export default App
