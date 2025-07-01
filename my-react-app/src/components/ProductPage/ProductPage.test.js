import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ProductPage from "./ProductPage";

// Mock Sidebar (since we don't test it)
jest.mock("../Sidebar/Sidebar", () => () => <div data-testid="sidebar" />);

describe("ProductPage", () => {
  it("renders sidebar and Products title", () => {
    render(<ProductPage />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("renders initial products", () => {
    render(<ProductPage />);
    expect(screen.getAllByText(/Banana|WaterMelon|Pinaaple|Mango|Tomato|Apple|Spinach/).length).toBeGreaterThan(0);
  });

  it("can search for a product by name", () => {
    render(<ProductPage />);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "apple" } });
    expect(screen.getAllByText(/Apple/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/Tomato/i)).not.toBeInTheDocument();
  });

  it("shows Add Product modal and validates required fields", () => {
    render(<ProductPage />);
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add New Product")).toBeInTheDocument();
    // Try to submit empty form
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add New Product")).toBeInTheDocument(); // Modal still open
  });

  it("prevents adding duplicate product", async () => {
    render(<ProductPage />);
    fireEvent.click(screen.getByText("Add"));
    const nameInput = screen.getByLabelText(/Name:/i);
    fireEvent.change(nameInput, { target: { value: "Banana" } });
    fireEvent.change(screen.getByLabelText(/Category:/i), { target: { value: "Fruits" } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: "99KSH" } });
    fireEvent.change(screen.getByLabelText(/Availability:/i), { target: { value: "10 kg" } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: "Test banana" } });
    // Mock image file input (simulate a file)
    const file = new File(["dummy"], "banana.png", { type: "image/png" });
    const fileInput = screen.getByLabelText(/Image:/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText(/^Add$/));
    await waitFor(() => {
      expect(screen.getByText(/Product already exists!/)).toBeInTheDocument();
    });
  });

  it("shows product details modal on card click", () => {
    render(<ProductPage />);
    fireEvent.click(screen.getAllByText("Banana")[0]);
    // The modal is open, so find by role 'dialog' and check for Banana in the modal
    const modal = screen.getByRole('dialog', { name: /Banana details/i });
    expect(within(modal).getByText(/Banana/)).toBeInTheDocument();
    expect(within(modal).getByText("Edit")).toBeInTheDocument();
    expect(within(modal).getByText("Delete")).toBeInTheDocument();
  });

  it("can delete a product after confirmation", async () => {
    render(<ProductPage />);
    const firstBanana = screen.getAllByText("Banana")[0];
    fireEvent.click(firstBanana);
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(
        screen.getByText((content, node) =>
          node.textContent.includes("Are you sure you want to delete") &&
          node.textContent.includes("Banana")
        )
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByText(/^Delete$/)[1]); // The second Delete button is in the confirm modal
    await waitFor(() => {
      expect(
        screen.queryByText((content, node) =>
          node.textContent.includes("Are you sure you want to delete") &&
          node.textContent.includes("Banana")
        )
      ).not.toBeInTheDocument();
    });
  });

  it("can open edit modal from details and close it", () => {
    render(<ProductPage />);
    fireEvent.click(screen.getAllByText("Banana")[0]);
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Edit Product")).not.toBeInTheDocument();
  });
});