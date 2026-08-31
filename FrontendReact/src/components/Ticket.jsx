import { useState } from 'react'
import {
    createTicket,
    updateTicketStatus,
} from '../api'

function Tickets({
    user,
    tickets,
    loading,
    setLoading,
    notice,
    setNotice,
    loadTickets,
    token,
    logout,
}) {
    const [ticket, setTicket] = useState({
        subject: '',
        message: '',
    })

    const submitTicket = async (event) => {
        event.preventDefault()
        setLoading(true)
        setNotice('')

        try {
            await createTicket(ticket, token)

            setTicket({
                subject: '',
                message: '',
            })

            setNotice(
                'Ticket submitted.'
            )

            await loadTickets()
        } catch (error) {
            setNotice(error.message)
        } finally {
            setLoading(false)
        }
    }

    const changeStatus = async (ticketId, status) => {
        setLoading(true)
        setNotice('')

        try {
            await updateTicketStatus(
                ticketId,
                status,
                token
            )

            setNotice('Ticket status updated.')

            await loadTickets()
        } catch (error) {
            setNotice(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="app-shell">
            <header>
                <div>
                    <p className="eyebrow">
                        Acme Support
                    </p>

                    <h1>Ticket desk</h1>
                </div>

                <div className="account">
                    <span>
                        {user.name} · <b>{user.role}</b>
                    </span>

                    <button
                        className="link"
                        onClick={logout}
                    >
                        Sign out
                    </button>
                </div>
            </header>


            <section className="grid">

                {/* Submit ticket */}

                <form
                    className="card ticket-form"
                    onSubmit={submitTicket}
                >
                    <h2>Submit a ticket</h2>

                    <label>
                        Subject

                        <input
                            required
                            value={ticket.subject}
                            onChange={(e) =>
                                setTicket({
                                    ...ticket,
                                    subject: e.target.value,
                                })
                            }
                            placeholder="What do you need help with?"
                        />
                    </label>

                    <label>
                        Message

                        <textarea
                            required
                            value={ticket.message}
                            onChange={(e) =>
                                setTicket({
                                    ...ticket,
                                    message: e.target.value,
                                })
                            }
                            placeholder="Describe the issue…"
                            rows="6"
                        />
                    </label>

                    <button disabled={loading}>
                        {loading
                            ? 'Submitting…'
                            : 'Submit ticket'}
                    </button>

                    <p className="hint">
                        Topic and urgency are assigned
                        automatically.
                    </p>

                    {notice && (
                        <p className="notice">
                            {notice}
                        </p>
                    )}
                </form>


                {/* Ticket list */}

                <section className="card tickets">

                    <div className="section-title">
                        <div>
                            <h2>
                                {user.role === 'admin'
                                    ? 'All tickets'
                                    : 'Your tickets'}
                            </h2>

                            <p className="subtle">
                                {tickets.length} total
                            </p>
                        </div>

                        <button
                            type="button"
                            className="secondary"
                            onClick={loadTickets}
                            disabled={loading}
                        >
                            Refresh
                        </button>
                    </div>


                    <div className="table-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>Subject</th>

                                    {user.role === 'admin' && (
                                        <th>User ID</th>
                                    )}

                                    <th>Category</th>
                                    <th>Urgency</th>
                                    <th>Status</th>

                                    {user.role === 'admin' && (
                                        <th>Action</th>
                                    )}
                                </tr>
                            </thead>


                            <tbody>

                                {tickets.length ? (

                                    tickets.map((item) => (

                                        <tr key={item.id}>

                                            <td>
                                                <strong>
                                                    {item.subject}
                                                </strong>

                                                <small>
                                                    {item.message}
                                                </small>
                                            </td>


                                            {user.role === 'admin' && (
                                                <td>
                                                    {item.user_id}
                                                </td>
                                            )}


                                            <td>
                                                {item.category}
                                            </td>


                                            <td>
                                                <span
                                                    className={`badge ${item.urgency}`}
                                                >
                                                    {item.urgency}
                                                </span>
                                            </td>


                                            <td>
                                                <span className="badge status">
                                                    {item.status}
                                                </span>
                                            </td>


                                            {user.role === 'admin' && (

                                                <td>

                                                    <select
                                                        value={item.status}
                                                        onChange={(e) =>
                                                            changeStatus(
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={loading}
                                                    >
                                                        <option value="open">
                                                            Open
                                                        </option>

                                                        <option value="in_progress">
                                                            In Progress
                                                        </option>

                                                        <option value="closed">
                                                            Closed
                                                        </option>
                                                    </select>

                                                </td>

                                            )}

                                        </tr>

                                    ))

                                ) : (

                                    <tr>
                                        <td
                                            colSpan={
                                                user.role === 'admin'
                                                    ? 6
                                                    : 4
                                            }
                                            className="empty"
                                        >
                                            No tickets yet.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </section>
        </main>
    )
}

export default Tickets