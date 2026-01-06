import React, { useState } from 'react';
import { submitFeedback } from '../api';
import './UserDashboard.css';

const UserDashboard = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    try {
      const result = await submitFeedback(rating, review);
      setResponse(result);
      setSubmitted(true);
      setReview('');
      setRating(0);

      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setResponse(null);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="container">
        <h1>Share Your Feedback</h1>
        <p className="subtitle">Help us improve by sharing your experience</p>

        {submitted && response && (
          <div className="success-container">
            <h2>Thank you for your feedback!</h2>
            <div className="ai-response">
              <h3>Our Response:</h3>
              <p>{response.ai_response}</p>
            </div>
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label>How would you rate your experience?</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    title={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && <p className="rating-text">{rating} out of 5 stars</p>}
            </div>

            <div className="form-group">
              <label htmlFor="review">Your Review</label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience... (max 5000 characters)"
                maxLength="5000"
                disabled={loading}
              />
              <p className="char-count">{review.length}/5000</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !rating || !review.trim()}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
