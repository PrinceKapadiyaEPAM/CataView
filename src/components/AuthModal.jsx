function AuthModal({
  isOpen,
  authMode,
  onModeChange,
  fullName,
  onFullNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  authMessage,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-3 sm:p-4" role="presentation" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`rounded-xl border px-3 py-2.5 font-semibold transition ${
              authMode === 'login'
                ? 'border-teal-700 bg-cyan-50 text-teal-700'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => onModeChange('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`rounded-xl border px-3 py-2.5 font-semibold transition ${
              authMode === 'register'
                ? 'border-teal-700 bg-cyan-50 text-teal-700'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => onModeChange('register')}
          >
            Register
          </button>
        </div>

        <h2 id="auth-title" className="my-1 mb-3 text-xl font-semibold text-slate-900 sm:text-2xl">
          {authMode === 'login' ? 'Login to CataView' : 'Create your account'}
        </h2>

        <form className="grid gap-2" onSubmit={onSubmit}>
          {authMode === 'register' && (
            <>
              <label htmlFor="fullName" className="text-sm text-slate-700">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => onFullNameChange(event.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-teal-700"
              />
            </>
          )}

          <label htmlFor="email" className="text-sm text-slate-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
            required
            className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-teal-700"
          />

          <label htmlFor="password" className="text-sm text-slate-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Enter password"
            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
            required
            className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-teal-700"
          />

          {authMode === 'register' && (
            <>
              <label htmlFor="confirmPassword" className="text-sm text-slate-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
                className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-teal-700"
              />
            </>
          )}

          {authMessage && <p className="mt-1 mb-0 text-sm text-red-700">{authMessage}</p>}

          <div className="mt-2 flex flex-wrap gap-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-teal-700 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register'}
            </button>
            <button
              type="button"
              className="rounded-xl bg-slate-700 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthModal
