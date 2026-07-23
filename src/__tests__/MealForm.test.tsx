import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MealForm } from "@/components/MealForm";
import * as api from "@/lib/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  getCalories: vi.fn(),
  ApiError: class extends Error {
    status: number;
    constructor(msg: string, status: number) {
      super(msg);
      this.status = status;
    }
  },
}));

describe("MealForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation error for empty fields", async () => {
    render(<MealForm />);
    
    const submitButton = screen.getByRole("button", { name: /Lookup Meal/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Dish name is required")).toBeInTheDocument();
  });

  it("shows validation error for negative servings", async () => {
    render(<MealForm />);

    const dishInput = screen.getByLabelText(/Dish Name/i);
    const servingsInput = screen.getByLabelText(/Servings/i);
    const submitButton = screen.getByRole("button", { name: /Lookup Meal/i });

    fireEvent.change(dishInput, { target: { value: "Apple Pie" } });
    fireEvent.change(servingsInput, { target: { value: "-2" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Servings must be a positive number")).toBeInTheDocument();
  });

  it("submits properly with valid inputs", async () => {
    const mockResult = {
      dish_name: "Apple",
      servings: 1,
      total_calories: 52,
    };
    
    vi.mocked(api.getCalories).mockResolvedValue(mockResult as any);

    render(<MealForm />);

    const dishInput = screen.getByLabelText(/Dish Name/i);
    const servingsInput = screen.getByLabelText(/Servings/i);
    const submitButton = screen.getByRole("button", { name: /Lookup Meal/i });

    fireEvent.change(dishInput, { target: { value: "Apple" } });
    fireEvent.change(servingsInput, { target: { value: "1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.getCalories).toHaveBeenCalledWith({
        dish_name: "Apple",
        servings: 1,
      });
    });
  });
});
