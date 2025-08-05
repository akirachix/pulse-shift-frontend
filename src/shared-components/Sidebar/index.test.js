
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from ".";  



const renderWithRouter = (ui, { route = "/" } = {}) => {
    return render(ui, {
        wrapper: ({ children }) => (
            <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }} initialEntries={[route]}>
                {children}
            </MemoryRouter>
        ),
    });
};

describe("Sidebar Component", () => {
    test("renders sidebar logo", () => {
        renderWithRouter(<Sidebar />);
        const logo = screen.getByAltText(/greens mtaani logo/i);
        expect(logo).toBeInTheDocument();
    });

    test("renders all nav links (top and bottom)", () => {
        renderWithRouter(<Sidebar />);
        const navLabels = [
            "Home",
            "Products",
            "Orders",
            "Sales",
            "Settings",
            "Log Out",
        ];
        navLabels.forEach((label) => {
            expect(screen.getByText(new RegExp(label, "i"))).toBeInTheDocument();
        });
    });

    test("renders correct number of icons", () => {
        const { container } = renderWithRouter(<Sidebar />);
        const icons = container.querySelectorAll(".sidebar-icon");
        expect(icons.length).toBe(6);
    });

    test("highlights Home as active by default on '/' route", () => {
        renderWithRouter(<Sidebar />, { route: "/" });
        const homeLink = screen.getByText(/Home/i).closest("a");
        expect(homeLink).toHaveClass("active");
        expect(homeLink.querySelector(".sidebar-pill")).toBeInTheDocument();
    });

    test("highlights Products as active when at '/products'", () => {
        renderWithRouter(<Sidebar />, { route: "/products" });
        const productsLink = screen.getByText(/Products/i).closest("a");
        expect(productsLink).toHaveClass("active");
        expect(productsLink.querySelector(".sidebar-pill")).toBeInTheDocument();
    });

    test("does not highlight Home as active on '/products' route", () => {
        renderWithRouter(<Sidebar />, { route: "/products" });
        const homeLink = screen.getByText(/Home/i).closest("a");
        expect(homeLink).not.toHaveClass("active");
    });

    test("renders sidebar-pill only for active nav link", () => {
        const { container } = renderWithRouter(<Sidebar />, { route: "/orders" });
        const pills = container.querySelectorAll(".sidebar-pill");
        expect(pills.length).toBe(1);
        const ordersLink = screen.getByText(/Orders/i).closest("a");
        expect(ordersLink.querySelector(".sidebar-pill")).toBeInTheDocument();
    });

    test("navigates to correct route when nav link is clicked", async () => {
        const user = userEvent.setup();
        const { container } = renderWithRouter(<Sidebar />, { route: "/" });

        const productsLink = screen.getByText(/Products/i);
        await user.click(productsLink);

        expect(productsLink.closest("a")).toHaveClass("active");
        expect(productsLink.closest("a").querySelector(".sidebar-pill")).toBeInTheDocument();

        const pills = container.querySelectorAll(".sidebar-pill");
        expect(pills.length).toBe(1);
    });
});