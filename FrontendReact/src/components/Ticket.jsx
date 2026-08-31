import { useState } from 'react'

function Tickets({ user, tickets, loading, notice, setNotice, loadTickets, api, logout }) {
  const [ticket, setTicket] = useState({
    subject: '',
    message: '',
  })

  const submitTicket = async (event) => {
    event.preventDefault()
    setLoading(true)
    setNotice('')

    try {
      await api('/api/tickets', {
        method: 'POST',
        body: JSON.stringify(ticket),
      })

      setTicket({
        subject: '',
        message: '',
      })

      setNotice('Ticket submitted and automatically triaged.')
      loadTickets()
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
          <p className="eyebrow">Acme Support</p>
          <h1>Ticket desk</h1>
        </div>

        <div className="account">
          <span>
            {user.name} · <b>{user.role}</b>
          </span>

          <button className="link" onClick={logout}>
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
            {loading ? 'Submitting…' : 'Submit ticket'}
          </button>

          <p className="hint">
            Topic and urgency are assigned automatically.
          </p>

          {notice && <p className="notice">{notice}</p>}
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
              className="secondary"
              onClick={loadTickets}
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
                </tr>
              </thead>

              <tbody>
                {tickets.length ? (
                  tickets.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.subject}</strong>
                        <small>{item.message}</small>
                      </td>

                      {user.role === 'admin' && (
                        <td>{item.user_id}</td>
                      )}

                      <td>{item.category}</td>

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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={user.role === 'admin' ? 5 : 4}
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