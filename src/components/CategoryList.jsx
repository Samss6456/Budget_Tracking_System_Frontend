import React, { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../services/api";

export default function CategoryList({ onDelete, onToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(data || []);
    } catch {
      setError("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      setDeletingId(id);
      await deleteCategory(id);
      await load();
      if (onDelete) onDelete();
      if (onToast) onToast("Category deleted successfully", "success");
    } catch (error) {
      const errorMsg = error.message || "Failed to delete category";
      setError(errorMsg);
      if (onToast) onToast(errorMsg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!categories.length) return <div className="empty-state">No categories yet. Add your first category above!</div>;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "25%" }}>Category Name</th>
            <th style={{ width: "20%" }}>Allocated Amount</th>
            <th>Description</th>
            <th style={{ width: "15%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className={deletingId === c.id ? "deleting" : ""}>
              <td>{c.id}</td>
              <td>{c.categoryName}</td>
              <td>${Number(c.allocatedAmount).toFixed(2)}</td>
              <td>{c.description || <em>No description</em>}</td>
              <td>
                <button 
                  className="btn-danger"
                  onClick={() => handleDelete(c.id)}
                  disabled={deletingId === c.id}
                >
                  {deletingId === c.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
