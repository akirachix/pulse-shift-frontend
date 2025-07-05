/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Sidebar from ".";

const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(ui, { wrapper: MemoryRouter });
};

describe("Sidebar Component", () => {
    test("renders sidebar logo", () => {
        renderWithRouter(<Sidebar />);
        const logo = screen.getByAltText(/greens mtaani logo/i);
        expect(logo).toBeInTheDocument();
    });

    test("renders all nav links (top and bottom)", () => {
        renderWithRouter(<Sidebar />);
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Products/i)).toBeInTheDocument();
        expect(screen.getByText(/Orders/i)).toBeInTheDocument();
        expect(screen.getByText(/Sales/i)).toBeInTheDocument();
        expect(screen.getByText(/Settings/i)).toBeInTheDocument();
        expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    });

    test("renders correct icons for links", () => {
        renderWithRouter(<Sidebar />);
        expect(screen.getAllByTestId("svg-inline--fa").length).toBe(6);
    });

    test("highlights Home as active by default on '/' route", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Sidebar />
            </MemoryRouter>
        );
        const homeLink = screen.getByText(/Home/i).closest("a");
        expect(homeLink).toHaveClass("active");
        expect(homeLink.querySelector(".sidebar-pill")).toBeInTheDocument();
    });

    test("highlights Products as active when at '/products'", () => {
        render(
            <MemoryRouter initialEntries={["/products"]}>
                <Sidebar />
            </MemoryRouter>
        );
        const productsLink = screen.getByText(/Products/i).closest("a");
        expect(productsLink).toHaveClass("active");
        expect(productsLink.querySelector(".sidebar-pill")).toBeInTheDocument();
    });

    test("does not highlight Home as active on '/products' route", () => {
        render(
            <MemoryRouter initialEntries={["/products"]}>
                <Sidebar />
            </MemoryRouter>
        );
        const homeLink = screen.getByText(/Home/i).closest("a");
        expect(homeLink).not.toHaveClass("active");
    });

    test("renders sidebar-pill only for active nav link", () => {
        render(
            <MemoryRouter initialEntries={["/orders"]}>
                <Sidebar />
            </MemoryRouter>
        );
        expect(screen.getAllByText((content, element) => {
            return element.classList.contains("sidebar-pill");
        }).length).toBe(1);
        const ordersLink = screen.getByText(/Orders/i).closest("a");
        expect(ordersLink.querySelector(".sidebar-pill")).toBeInTheDocument();
    });

    test("navigates to correct route when nav link is clicked", async () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Sidebar />
            </MemoryRouter>
        );
        const user = userEvent.setup();
        const productsLink = screen.getByText(/Products/i);
        await user.click(productsLink);
        expect(productsLink).toBeInTheDocument();
    });
});