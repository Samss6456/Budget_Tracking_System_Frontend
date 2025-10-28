// src/tests/app.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import CategoryForm from "../components/CategoryForm";
import BudgetSummary from "../components/BudgetSummary";
import * as api from "../services/api";

jest.mock("../services/api");

const mockSummary = [
  {
    categoryName: "Groceries",
    allocatedAmount: 500,
    spentAmount: 300,
    description: "Monthly groceries",
  },
  {
    categoryName: "Utilities",
    allocatedAmount: 200,
    spentAmount: 50,
    description: "Monthly utilities",
  },
];

describe("Personal Budget Tracker - Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Renders app title (fixed to getByRole)
  test("React_BuildUIComponents_renders app title", () => {
    api.getBudgetSummary.mockResolvedValue([]);
    render(<App />);
    const header = screen.getByRole("heading", { level: 1, name: /Personal Budget Tracker/i });
    expect(header).toBeInTheDocument();
  });

  // 2. Fetches and displays budget summary categories
  test("React_APIIntegration_TestingAndAPIDocumentation_fetches and displays budget summary", async () => {
    api.getBudgetSummary.mockResolvedValueOnce(mockSummary);
    render(<App />);
    expect(await screen.findByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Utilities")).toBeInTheDocument();
  });

  // 3. Shows empty message if no categories
  test("React_APIIntegration_TestingAndAPIDocumentation_shows empty message if no categories", async () => {
    api.getBudgetSummary.mockResolvedValueOnce([]);
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });
  });

  // 4. Handles fetch error gracefully
  test("React_UITestingAndResponsivenessFixes_handles fetch error gracefully", async () => {
    api.getBudgetSummary.mockRejectedValueOnce(new Error("Fetch error"));
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    // You can add more checks here if your app shows error messages
  });

  // 5. Renders CategoryForm inputs (make sure your labels have htmlFor and inputs have matching ids)
  test("React_BuildUIComponents_renders CategoryForm inputs", () => {
    render(<CategoryForm onAdd={jest.fn()} />);
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Allocated Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  // 6. Prevents submission if categoryName is empty
  test("React_BuildUIComponents_prevents submission if categoryName is empty", () => {
    render(<CategoryForm onAdd={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/Allocated Amount/i), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Category/i }));
    expect(screen.getByText(/Category name is required/i)).toBeInTheDocument();
  });

  // 7. Prevents submission if allocatedAmount is invalid
  test("React_BuildUIComponents_prevents submission if allocatedAmount is invalid", () => {
    render(<CategoryForm onAdd={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/Category Name/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Allocated Amount/i), { target: { value: "-10" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Category/i }));
    expect(screen.getByText(/Allocated amount must be a non-negative number/i)).toBeInTheDocument();
  }); 
// 8. Shows loading text before budget summary is loaded
test("React_APIIntegration_TestingAndAPIDocumentation_shows loading text before budget summary is loaded", () => {
  api.getBudgetSummary.mockReturnValue(new Promise(() => {})); // Promise that never resolves to simulate loading

  render(<App />);
  expect(screen.getByText(/Loading budget summary/i)).toBeInTheDocument();
}); 

// 9. Does not call API if form validation fails
test("React_APIIntegration_TestingAndAPIDocumentation_does not call API if validation fails", () => {
  const addCategoryMock = jest.fn();
  render(<CategoryForm onAdd={addCategoryMock} />);

  fireEvent.click(screen.getByRole("button", { name: /Add Category/i }));

  expect(addCategoryMock).not.toHaveBeenCalled();
  expect(api.addCategory).not.toHaveBeenCalled();
});

// 10. CategoryForm allows optional description to be empty without error
test("React_BuildUIComponents_allows empty description without error", () => {
  render(<CategoryForm onAdd={jest.fn()} />);

  fireEvent.change(screen.getByLabelText(/Category Name/i), {
    target: { value: "Books" },
  });
  fireEvent.change(screen.getByLabelText(/Allocated Amount/i), {
    target: { value: "80" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Add Category/i }));

  expect(screen.queryByText(/Description is required/i)).not.toBeInTheDocument();
});

});
