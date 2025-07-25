import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Sidebar } from ".";

const renderWithHistory = (ui, { route = "/" } = {}) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const utils = render(
    <Router
      location={history.location}
      navigator={history}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {ui}
    </Router>
  );
  return { ...utils, history };
};

describe("Sidebar Component", () => {
  test("renders sidebar logo", () => {
    renderWithHistory(<Sidebar />);
    expect(screen.getByAltText(/greens mtaani logo/i)).toBeInTheDocument();
  });

  test("renders all nav links (top and bottom)", () => {
    renderWithHistory(<Sidebar />);
    const navLabels = [
      "Home",
      "Products",
      "Orders",
      "Sales",
      "Users",
      "Settings",
      "Log Out",
    ];
    navLabels.forEach((label) => {
      expect(screen.getByText(new RegExp(label, "i"))).toBeInTheDocument();
    });
  });

  test("renders correct number of icons", () => {
    renderWithHistory(<Sidebar />);
    const icons = screen.getAllByTestId("sidebar-icon");
    expect(icons.length).toBe(7); // total nav items
  });

  test("highlights Home as active by default on '/' route", () => {
    renderWithHistory(<Sidebar />, { route: "/" });
    const homeLink = screen.getByText(/Home/i).closest("a");
    expect(homeLink).toHaveClass("active");
    expect(homeLink.querySelector(".sidebar-pill")).toBeInTheDocument();
  });

  test("highlights Products as active when at '/products'", () => {
    renderWithHistory(<Sidebar />, { route: "/products" });
    const productsLink = screen.getByText(/Products/i).closest("a");
    expect(productsLink).toHaveClass("active");
    expect(productsLink.querySelector(".sidebar-pill")).toBeInTheDocument();
  });

  test("does not highlight Home as active on '/products' route", () => {
    renderWithHistory(<Sidebar />, { route: "/products" });
    const homeLink = screen.getByText(/Home/i).closest("a");
    expect(homeLink).not.toHaveClass("active");
  });

  test("renders sidebar-pill only for active nav link", () => {
    const { container } = renderWithHistory(<Sidebar />, { route: "/orders" });
    const pills = container.querySelectorAll(".sidebar-pill");
    expect(pills.length).toBe(1);
    const ordersLink = screen.getByText(/Orders/i).closest("a");
    expect(ordersLink.querySelector(".sidebar-pill")).toBeInTheDocument();
  });

  test("navigates to correct route when nav link is clicked", async () => {
    const user = userEvent.setup();
    const { history, rerender, container } = renderWithHistory(<Sidebar />, { route: "/" });

    const productsLink = screen.getByText(/Products/i);
    await user.click(productsLink);

    history.push("/products");

    rerender(
      <Router
        location={history.location}
        navigator={history}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Sidebar />
      </Router>
    );

    const updatedProductsLink = screen.getByText(/Products/i).closest("a");
    expect(updatedProductsLink).toHaveClass("active");
    expect(updatedProductsLink.querySelector(".sidebar-pill")).toBeInTheDocument();

    const pills = container.querySelectorAll(".sidebar-pill");
    expect(pills.length).toBe(1);
  });
});
