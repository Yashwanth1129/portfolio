export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5241';

export async function sendContactMessage({ name, email, subject, message }) {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to send message');
  }

  return data;
}
