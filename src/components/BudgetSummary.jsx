import React, { useEffect, useState } from "react";
import { getBudgetSummary } from "../services/api";

export default function BudgetSummary({ onToast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getBudgetSummary()
      .then((data) => { 
        if (mounted) {
          setRows(data || []);
        }
      })
      .catch((error) => { 
        if (mounted) {
          const errorMsg = error.message || "Failed to load budget summary";
          setError(errorMsg);
          setRows([]);
          if (onToast) onToast(errorMsg, "error");
        }
      })
      .finally(() => { 
        if (mounted) setLoading(false); 
      });
    return () => { mounted = false; };
  }, [onToast]);

  const calculateTotals = () => {
    return rows.reduce((acc, row) => ({
      allocated: acc.allocated + (Number(row.allocatedAmount) || 0),
      spent: acc.spent + (Number(row.spentAmount) || 0),
      remaining: acc.remaining + (Number(row.remainingAmount) || 0)
    }), { allocated: 0, spent: 0, remaining: 0 });
  };

  const getProgressPercentage = (spent, allocated) => {
    if (!allocated) return 0;
    return Math.min((spent / allocated) * 100, 100);
  };

  if (loading) return <div className="loading">Loading budget summary...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!rows || rows.length === 0) return <div className="empty-state">No budget data yet. Add some categories to see your budget summary!</div>;

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    getBudgetSummary()
      .then((data) => setRows(data || []))
      .catch((error) => {
        const errorMsg = error.message || "Failed to load budget summary";
        setError(errorMsg);
        if (onToast) onToast(errorMsg, "error");
      })
      .finally(() => setLoading(false));
  };

  const totals = calculateTotals();

  return (
    <div>
      <div className="section-header">
        <button className="btn-refresh" onClick={handleRefresh} disabled={loading}>
          {loading ? "🌀 Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      
      <div className="summary-cards">
        <div className="summary-card" onClick={() => onToast && onToast(`💰 Total Allocated: $${totals.allocated.toFixed(2)}`, "info")}>
          <div className="card-icon">💰</div>
          <h3>Total Allocated</h3>
          <div className="amount">${totals.allocated.toFixed(2)}</div>
          <div className="card-subtitle">Click for details</div>
        </div>
        <div className="summary-card" onClick={() => onToast && onToast(`💸 Total Spent: $${totals.spent.toFixed(2)}`, "info")}>
          <div className="card-icon">💸</div>
          <h3>Total Spent</h3>
          <div className="amount">${totals.spent.toFixed(2)}</div>
          <div className="card-subtitle">Click for details</div>
        </div>
        <div className="summary-card" onClick={() => onToast && onToast(`💎 Total Remaining: $${totals.remaining.toFixed(2)}`, totals.remaining < 0 ? "error" : "success")}>
          <div className="card-icon">💎</div>
          <h3>Total Remaining</h3>
          <div className="amount">${totals.remaining.toFixed(2)}</div>
          <div className="card-subtitle">Click for details</div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Allocated</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const allocated = Number(r.allocatedAmount) || 0;
              const spent = Number(r.spentAmount) || 0;
              const remaining = Number(r.remainingAmount) || 0;
              const progress = getProgressPercentage(spent, allocated);
              
              return (
                <tr key={idx}>
                  <td><strong>{r.categoryName}</strong></td>
                  <td>${allocated.toFixed(2)}</td>
                  <td>${spent.toFixed(2)}</td>
                  <td className={remaining < 0 ? "negative" : "positive"}>
                    ${remaining.toFixed(2)}
                  </td>
                  <td>
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: progress > 90 ? '#dc3545' : progress > 70 ? '#ffc107' : '#28a745'
                        }}
                      ></div>
                      <span className="progress-text">{progress.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
