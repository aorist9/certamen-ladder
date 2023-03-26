import React from "react";
import { render, screen } from "@testing-library/react";
import LadderDisplay from "./LadderDisplay";
import { HashRouter } from "react-router-dom";
import ladderService from "../services/ladderService";

jest.mock("../services/ladderService", () => ({
	addLadder: jest.fn(),
	editLadder: jest.fn(),
	getLadders: jest.fn(),
	getLadder: jest.fn()
}));
jest.mock("react-router-dom", () => ({
	...(jest.requireActual("react-router-dom") as object),
	useSearchParams: () => [{ get: () => "123" }]
}));

const renderLadderDisplay = () => {
	render(
		<HashRouter>
			<LadderDisplay />
		</HashRouter>
	);
};

describe("LadderDisplay", () => {
	test("should show error message when ladder is not found", () => {
		renderLadderDisplay();
		expect(
			screen.getByText("You may have reached this page in error")
		).toBeInTheDocument();
	});

	describe("single division", () => {
		beforeEach(() => {
			// @ts-ignore
			ladderService.getLadder.mockReturnValue({
				id: "123",
				draw: 0,
				name: "My Ladder",
				rounds: 17,
				type: 0,
				teams: {
					G: "Georgya",
					B: "Bama",
					A: "Arizona",
					C: "Capitol One",
					H: "Highlanders",
					Z: "Zebras"
				}
			});
		});

		test("should display the ladder name", () => {
			renderLadderDisplay();
			expect(screen.getByText("My Ladder")).toBeInTheDocument();
		});

		test("should display the teams in the correct order", () => {
			renderLadderDisplay();
			const rounds = screen.getAllByTestId("round-1");
			expect(rounds).toHaveLength(3);
			expect(rounds[0].textContent).toContain("Arizona");
			expect(rounds[0].textContent).toContain("Bama");
			expect(rounds[1].textContent).toContain("Capitol One");
			expect(rounds[1].textContent).toContain("Georgya");
			expect(rounds[2].textContent).toContain("Highlanders");
			expect(rounds[2].textContent).toContain("Zebras");
		});
	});

	describe("multiple divisions", () => {
		beforeEach(() => {
			// @ts-ignore
			ladderService.getLadder.mockReturnValue({
				id: "123",
				divisions: 3,
				draw: 0,
				name: "My Ladder",
				rounds: 17,
				type: 0,
				teams: [
					{
						division: "The Div",
						teams: {
							G: "Georgya",
							B: "Bama",
							A: "Arizona",
							C: "Capitol One",
							H: "Highlanders",
							Z: "Zebras"
						}
					},
					{
						division: "The Other Div",
						teams: {
							A: "A",
							Z: "Z",
							Y: "Y"
						}
					}
				]
			});
		});

		test("should display the ladder name", () => {
			renderLadderDisplay();
			expect(screen.getByText("My Ladder")).toBeInTheDocument();
		});

		test("should display the teams in the correct order", () => {
			renderLadderDisplay();
			const rounds = screen.getAllByTestId("round-1");
			expect(rounds).toHaveLength(4);
			expect(rounds[0].textContent).toContain("Arizona");
			expect(rounds[0].textContent).toContain("Bama");
			expect(rounds[1].textContent).toContain("Capitol One");
			expect(rounds[1].textContent).toContain("Georgya");
			expect(rounds[2].textContent).toContain("Highlanders");
			expect(rounds[2].textContent).toContain("Zebras");
		});
	});
});
