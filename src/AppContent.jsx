import React, { useState, useCallback } from "react";
import CategoryForm from "./components/CategoryForm";
import CategoryList from "./components/CategoryList";
import BudgetSummary from "./components/BudgetSummary";
import Toast from "./components/Toast";

export default function AppContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleDataChange = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  return (
    <div className="container">
      <h1>Personal Budget Tracker</h1>

      <section className="card">
        <h2>Add New Category</h2>
        <CategoryForm onAdd={handleDataChange} onToast={showToast} />
      </section>

      <section className="card">
        <h2>Budget Summary</h2>
        <BudgetSummary key={`summary-${refreshTrigger}`} onToast={showToast} />
      </section>

      <section className="card">
        <h2>All Categories</h2>
        <CategoryList key={`list-${refreshTrigger}`} onDelete={handleDataChange} onToast={showToast} />
      </section>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}