const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const contactService = {
  sendContactEmail: async (formData, token) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to send email');
    }

    return response.json();
  },
};