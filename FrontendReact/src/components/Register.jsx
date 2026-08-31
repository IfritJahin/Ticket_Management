import { useState } from 'react'

function Register({ onRegister, loading, notice, setNotice, goToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setNotice('')

    await onRegister({
      name,
      email,
      password,
    })
  }

  return (
    <main className="auth-shell">
      <section className="card auth-card">
        <p className="eyebrow">Acme Support</p>
        <h1>Create your account.</h1>
        <p className="subtle">
          Create an account to submit support tickets.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

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
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button disabled={loading}>
            {loading ? 'Please wait…' : 'Create account'}
          </button>
        </form>

        {notice && <p className="notice">{notice}</p>}

        <p className="switch">
          Already have an account?{' '}
          <button
            type="button"
            className="link"
            onClick={goToLogin}
          >
            Sign in
          </button>
        </p>
      </section>
    </main>
  )
}

export default Register