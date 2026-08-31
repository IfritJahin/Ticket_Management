import { useState } from 'react'

function Login({ onLogin, loading, notice, setNotice }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setNotice('')

    await onLogin({ email, password })
  }

  return (
    <main className="auth-shell">
      <section className="card auth-card">
        <p className="eyebrow">Acme Support</p>
        <h1>Support tickets, simply.</h1>
        <p className="subtle">
          Sign in to create and follow your requests.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button disabled={loading}>
            {loading ? 'Please wait…' : 'Sign in'}
          </button>
        </form>

        {notice && <p className="notice">{notice}</p>}
      </section>
    </main>
  )
}

export default Login