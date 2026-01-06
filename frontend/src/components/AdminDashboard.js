import React, { useState, useEffect } from 'react';
import { getSubmissions } from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [stats, setStats] = useState({ total: 0, byRating: {} });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubmissions(100, 0, ratingFilter);
      setSubmissions(data.submissions);
      setStats({ total: data.total, byRating: calculateStats(data.submissions) });
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subs) => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    subs.forEach((sub) => {
      stats[sub.rating]++;
    });
    return stats;
  };

  useEffect(() => {
    fetchSubmissions();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchSubmissions, 10000);
    return () => clearInterval(interval);
  }, [ratingFilter]);

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={fetchSubmissions} className="refresh-btn" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <span className="last-update">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="analytics-section">
          <div className="stat-card">
            <h3>Total Submissions</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="stat-card">
              <h3>{rating} ★ Ratings</h3>
              <p className="stat-number">{stats.byRating[rating] || 0}</p>
              <button
                onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                className={`filter-btn ${ratingFilter === rating ? 'active' : ''}`}
              >
                {ratingFilter === rating ? 'Clear Filter' : 'Filter'}
              </button>
            </div>
          ))}
        </div>

        <div className="submissions-section">
          <h2>Submissions {ratingFilter && `(${ratingFilter} ★)`}</h2>
          {submissions.length === 0 ? (
            <p className="no-submissions">No submissions yet</p>
          ) : (
            <div className="submissions-list">
              {submissions.map((submission) => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <div className="rating-badge">{submission.rating} ★</div>
                    <p className="timestamp">{new Date(submission.timestamp).toLocaleString()}</p>
                  </div>

                  <div className="submission-content">
                    <div className="review-section">
                      <h4>User Review:</h4>
                      <p>{submission.review}</p>
                    </div>

                    <div className="summary-section">
                      <h4>AI Summary:</h4>
                      <p>{submission.ai_summary}</p>
                    </div>

                    <div className="actions-section">
                      <h4>Recommended Actions:</h4>
                      <p>{submission.recommended_actions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
