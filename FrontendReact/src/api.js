const API_URL = 'http://localhost:8000'

export async function apiRequest(path, options = {}, token = '') {
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
        throw new Error(body.detail || 'Something went wrong')
    }

    return body
}

export async function login(credentials) {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    })
}

export async function register(data) {
    return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function getMe(token) {
    return apiRequest('/api/auth/me', {}, token)
}

export async function getTickets(token) {
    return apiRequest('/api/tickets', {}, token)
}

export async function createTicket(data, token) {
    return apiRequest('/api/tickets',
        {
            method: 'POST',
            body: JSON.stringify(data),
        },
        token
    )
}

export async function updateTicketStatus(ticketId, status, token) {
    return apiRequest(`/api/tickets/${ticketId}/status`,
        {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        },
        token
    )
}