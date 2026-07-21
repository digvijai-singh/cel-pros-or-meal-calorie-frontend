import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultCard } from "@/components/ResultCard";
import { CalorieResult } from "@/types";

const mockResultRequired: CalorieResult = {
  dish_name: "Mock Salad",
  servings: 2,
  data_source: "USDA Reference Database",
  calories_per_serving: 150,
  total_calories: 300,
  macronutrients_per_serving: {
    protein: 5,
    total_fat: 10,
    carbohydrates: 15,
  },
  total_macronutrients: {
    protein: 10,
    total_fat: 20,
    carbohydrates: 30,
  },
  ingredient_breakdown: [],
  matched_food: {
    name: "Mock Salad Reference",
    fdc_id: 12345,
    data_type: "SR Legacy",
    published_date: "2020-01-01",
  },
};

const mockResultAll: CalorieResult = {
  ...mockResultRequired,
  macronutrients_per_serving: {
    protein: 5,
    total_fat: 10,
    carbohydrates: 15,
    fiber: 3,
    sugars: 4,
    saturated_fat: 1,
  },
  total_macronutrients: {
    protein: 10,
    total_fat: 20,
    carbohydrates: 30,
    fiber: 6,
    sugars: 8,
    saturated_fat: 2,
  },
};

describe("ResultCard Component", () => {
  it("renders null when no result is provided", () => {
    const { container } = render(<ResultCard result={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders required fields properly", () => {
    render(<ResultCard result={mockResultRequired} />);

    expect(screen.getByText("Mock Salad")).toBeInTheDocument();
    
    const servingsHeaders = screen.getAllByText(/Servings/i);
    expect(servingsHeaders.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/300\.0/, { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText(/150\.0/, { selector: "span" })).toBeInTheDocument();

    expect(screen.getByText("5.0g")).toBeInTheDocument();
    expect(screen.getByText("15.0g")).toBeInTheDocument();
    expect(screen.getByText("10.0g")).toBeInTheDocument();
    
    expect(screen.queryByText(/Fiber/i)).not.toBeInTheDocument();
  });

  it("renders optional fields when present", () => {
    render(<ResultCard result={mockResultAll} />);

    expect(screen.getByText(/Fiber/i)).toBeInTheDocument();
    expect(screen.getByText(/3\.0g/, { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText(/Sugars/i)).toBeInTheDocument();
    expect(screen.getByText(/4\.0g/, { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText(/Sat\.\s*Fat/i)).toBeInTheDocument();
    expect(screen.getByText(/1\.0g/, { selector: "span" })).toBeInTheDocument();
  });
});
