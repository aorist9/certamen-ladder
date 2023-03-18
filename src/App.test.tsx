import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
	test("renders header", () => {
		render(<App />);
		const linkElement = screen.getAllByText(/Certamen Ladder/i);
		expect(linkElement.length).toBeGreaterThan(0);
	});

	test("includes sidebar", () => {
		render(<App />);
		expect(screen.getByText(/create a new ladder/i)).toBeInTheDocument();
	});
});
