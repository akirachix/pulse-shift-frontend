import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductPage from ".";

jest.mock("../sharedcomponent/Sidebar", () => () => <div data-testid="sidebar" />);

describe("ProductPage", () => {
  beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterAll(() => {
    window.alert.mockRestore();
  });

  it("renders all initial products (according to default 'In-Stock' tab)", () => {
    render(<ProductPage />);
    expect(screen.getByText(/WaterMelon/i)).toBeInTheDocument();
    expect(screen.getByText(/Pineapple/i)).toBeInTheDocument();
    expect(screen.getByText(/Mango/i)).toBeInTheDocument();


    const apple = screen.getAllByText(/Apple/i);
    expect(apple.length).toBeGreaterThan(0);

    expect(screen.getByText(/Banana/i)).toBeInTheDocument();

  
  });

  it("shows out-of-stock products when Out-of-Stock tab is clicked", () => {
    render(<ProductPage />);
    fireEvent.click(screen.getByText(/Out-of-Stock/i));
    expect(screen.getByText(/Tomato/i)).toBeInTheDocument();
    expect(screen.getByText(/Spinach/i)).toBeInTheDocument();
  });

  it("opens product details modal when a product is clicked", () => {
    render(<ProductPage />);
    fireEvent.click(screen.getByText(/Banana/i));
    expect(screen.getByRole("heading", { name: /Banana/i })).toBeInTheDocument();
    expect(screen.getByText(/Bananas are sweet, creamy fruits/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("opens add product modal when Add button is clicked", () => {
    render(<ProductPage />);
    fireEvent.click(screen.getByRole("button", { name: /^Add$/i }));
    expect(screen.getByRole("heading", { name: /add new product/i })).toBeInTheDocument();

    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes.length).toBeGreaterThanOrEqual(2);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add product/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("can close modals (details and add)", () => {
    render(<ProductPage />);
    fireEvent.click(screen.getByText(/Banana/i));
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("heading", { name: /Banana/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Add$/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("heading", { name: /add new product/i })).not.toBeInTheDocument();
  });
});
