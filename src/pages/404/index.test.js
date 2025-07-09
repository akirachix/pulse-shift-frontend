/* eslint-disable testing-library/no-render-in-setup */
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ComingSoon from ".";
import userEvent from "@testing-library/user-event";

describe("ComingSoon component", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <ComingSoon />
            </MemoryRouter>
        );
    });

    test("renders heading with emojis and text", () => {
        const heading = screen.getByRole("heading", { name: /coming soon/i });
        expect(heading).toBeInTheDocument();
        expect(heading.textContent).toMatch(/🚧 Coming Soon 🚧/);
    });

    test("renders the informational paragraph", () => {
        const paragraph = screen.getByText(/this page is under construction/i);
        expect(paragraph).toBeInTheDocument();
    });

    test("renders the back to home link", () => {
        const link = screen.getByRole("link", { name: /back to home/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/");
    });

    test("back to home link is clickable", async () => {
        const user = userEvent.setup();
        const link = screen.getByRole("link", { name: /back to home/i });
        await user.click(link);
        expect(link).toBeEnabled();
    });
});
