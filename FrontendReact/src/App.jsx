import { useEffect, useState } from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from 'react-router-dom'

import './App.css'

import Login from './components/Login'
import Register from './components/Register'
import Tickets from './components/Ticket'
import { getMe, getTickets, login, register } from './api'

function AppContent() {
    const [token, setToken] = useState(
        localStorage.getItem('ticket_token') || ''
    )

    const [user, setUser] = useState(null)
    const [tickets, setTickets] = useState([])

    const [notice, setNotice] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()


    // Check logged-in user
    useEffect(() => {
        if (!token) {
            return
        }

        getMe(token)
            .then((profile) => {
                setUser(profile)

                return getTickets(token)
            })
            .then((data) => {
                setTickets(data)
            })
            .catch(() => {
                localStorage.removeItem('ticket_token')
                setToken('')
                setUser(null)
                setTickets([])
                navigate('/login')
            })
    }, [token, navigate])


    // Login
    const handleLogin = async (credentials) => {
        setLoading(true)
        setNotice('')

        try {
            const result = await login(credentials)

            localStorage.setItem(
                'ticket_token',
                result.access_token
            )

            setToken(result.access_token)

            navigate('/tickets')
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
            await register(data)

            setNotice(
                'Account created. Please sign in.'
            )

            navigate('/login')
        } catch (error) {
            setNotice(error.message)
        } finally {
            setLoading(false)
        }
    }


    // Logout
    const logout = () => {
        localStorage.removeItem('ticket_token')

        setToken('')
        setUser(null)
        setTickets([])

        navigate('/login')
    }


    return (
        <Routes>

            <Route
                path="/login"
                element={
                    <Login
                        onLogin={handleLogin}
                        loading={loading}
                        notice={notice}
                        setNotice={setNotice}
                        goToRegister={() => {
                            setNotice('')
                            navigate('/register')
                        }}
                    />
                }
            />

            <Route
                path="/register"
                element={
                    <Register
                        onRegister={handleRegister}
                        loading={loading}
                        notice={notice}
                        setNotice={setNotice}
                        goToLogin={() => {
                            setNotice('')
                            navigate('/login')
                        }}
                    />
                }
            />

            <Route
                path="/tickets"
                element={
                    token && user ? (
                        <Tickets
                            user={user}
                            tickets={tickets}
                            loading={loading}
                            setLoading={setLoading}
                            notice={notice}
                            setNotice={setNotice}
                            loadTickets={() =>
                                getTickets(token).then(setTickets)
                            }
                            token={token}
                            logout={logout}
                        />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            token && user
                                ? '/tickets'
                                : '/login'
                        }
                    />
                }
            />

        </Routes>
    )
}


function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}


export default App
