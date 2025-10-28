import React, { useState } from "react";
import { addCategory } from "../services/api";

export default function CategoryForm({ onAdd, onToast }) {
  const [categoryName, setCategoryName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!categoryName.trim()) {
      setError("Category name is required");
      setLoading(false);
      return;
    }
    if (allocatedAmount === "" || Number(allocatedAmount) < 0) {
      setError("Allocated amount must be a non-negative number");
      setLoading(false);
      return;
    }

    try {
      await addCategory({
        categoryName: categoryName.trim(),
        allocatedAmount: Number(allocatedAmount),
        description: description.trim(),
      });
      setCategoryName("");
      setAllocatedAmount("");
      setDescription("");
      if (onToast) onToast("Category added successfully!", "success");
      if (onAdd) onAdd();
    } catch (error) {
      const errorMsg = error.message || "Failed to add category";
      setError(errorMsg);
      if (onToast) onToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-row">
        <div>
          <label htmlFor="categoryName">Category Name *</label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="allocatedAmount">Allocated Amount *</label>
          <input
            id="allocatedAmount"
            type="number"
            min="0"
            step="0.01"
            value={allocatedAmount}
            onChange={(e) => setAllocatedAmount(e.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div className="full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            disabled={loading}
          />
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
}
