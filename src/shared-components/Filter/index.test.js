import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomDropdownFilter from ".";

const FILTER_OPTIONS = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
];

describe("CustomDropdownFilter", () => {
    test("renders with default selected value", () => {
        render(
            <CustomDropdownFilter
                filterType="week"
                setFilterType={() => { }}
                options={FILTER_OPTIONS}
            />
        );
        expect(screen.getByRole("button")).toHaveTextContent("Week");
    });

    test("opens and closes dropdown on button click", () => {
        render(
            <CustomDropdownFilter
                filterType="week"
                setFilterType={() => { }}
                options={FILTER_OPTIONS}
            />
        );
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByRole("listbox")).toBeVisible();
        fireEvent.click(button);
        expect(screen.queryByRole("listbox")).toBeNull();
    });

    test("calls setFilterType on option click", () => {
        const setFilterType = jest.fn();
        render(
            <CustomDropdownFilter
                filterType="week"
                setFilterType={setFilterType}
                options={FILTER_OPTIONS}
            />
        );
        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByText("Month"));
        expect(setFilterType).toHaveBeenCalledWith("month");
    });
});
