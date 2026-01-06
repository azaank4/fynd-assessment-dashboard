const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const submitFeedback = async (rating, review) => {
  const response = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating, review }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit feedback');
  }

  return response.json();
};

const getSubmissions = async (limit = 50, skip = 0, rating = null) => {
  const params = new URLSearchParams({ limit, skip });
  if (rating) params.append('rating', rating);

  const response = await fetch(`${API_BASE_URL}/api/submissions?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }

  return response.json();
};

export { submitFeedback, getSubmissions };
