import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Tickets from './components/Ticket'



const API_URL = 'http://localhost:8000'

function App() {
  const [token, setToken] = useState(
    localStorage.getItem('ticket_token') || ''
  )

  const [page, setPage] = useState('login')

  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])

  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const api = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,

        headers: {
          'Content-Type': 'application/json',

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),

          ...options.headers,
        },
      })

      const body = await response.json()

      if (!response.ok) {
        throw new Error(
          body.detail || 'Something went wrong'
        )
      }

      return body
    },
    [token]
  )

  const loadTickets = useCallback(async () => {
    try {
      const data = await api('/api/tickets')
      setTickets(data)
    } catch (error) {
      setNotice(error.message)
    }
  }, [api])

  const logout = useCallback(() => {
    localStorage.removeItem('ticket_token')

    setToken('')
    setUser(null)
    setTickets([])
    setPage('login')
  }, [])

  // Check logged-in user
  useEffect(() => {
    if (!token) return

    api('/api/auth/me')
      .then((profile) => {
        setUser(profile)
        loadTickets()
      })
      .catch(() => {
        logout()
      })
  }, [token, api, loadTickets, logout])

  // Login
  const handleLogin = async (credentials) => {
    setLoading(true)
    setNotice('')

    try {
      const result = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      localStorage.setItem(
        'ticket_token',
        result.access_token
      )

      setToken(result.access_token)
    } catch (error) {
      setNotice(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Register
  const handleRegister = async (data) => {
    setLoading(true)
    setNotice('')

    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      setNotice(
        'Account created. Please sign in.'
      )

      setPage('login')
    } catch (error) {
      setNotice(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Not logged in
  if (!token || !user) {
    if (page === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          loading={loading}
          notice={notice}
          setNotice={setNotice}
          goToLogin={() => {
            setNotice('')
            setPage('login')
          }}
        />
      )
    }

    return (
      <Login
        onLogin={handleLogin}
        loading={loading}
        notice={notice}
        setNotice={setNotice}
      />
    )
  }

  // Logged in
  return (
    <Tickets
      user={user}
      tickets={tickets}
      loading={loading}
      setLoading={setLoading}
      notice={notice}
      setNotice={setNotice}
      loadTickets={loadTickets}
      api={api}
      logout={logout}
    />
  )
}

export default App