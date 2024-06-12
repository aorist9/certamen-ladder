import React from "react";
import { render, screen } from "@testing-library/react";
import LadderDisplay from "./LadderDisplay";
import { HashRouter } from "react-router-dom";
import ladderService, { useLadder } from "../services/ladderService";
import userEvent from "@testing-library/user-event";
import { Ladder } from "../types/LadderType";

jest.mock("../services/ladderService");
const mockUseLadder = jest.mocked(useLadder);
const mockLadderService = jest.mocked(ladderService);

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
			mockUseLadder.mockReturnValue(
				new Ladder({
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
				})
			);
		});

		test("should display the ladder name", () => {
			renderLadderDisplay();
			expect(screen.getByText("My Ladder")).toBeInTheDocument();
		});

		test.skip("should display the teams in the correct order", () => {
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

		test.skip("should add a column and change text of button when add rooms button is clicked", () => {
			renderLadderDisplay();
			userEvent.click(screen.getByText("Add Rooms"));
			expect(screen.getByText("Done Adding Rooms")).toBeInTheDocument();
			expect(screen.getAllByTestId("room")).toHaveLength(3);
			expect(screen.getAllByTestId("room-input")).toHaveLength(3);
		});

		test.skip("should save rooms when inputted", () => {
			renderLadderDisplay();
			userEvent.click(screen.getByText("Add Rooms"));
			const inputs = screen.getAllByTestId("room-input");
			userEvent.type(inputs[0], "abra");
			userEvent.type(inputs[1], "kadabra");
			userEvent.type(inputs[2], "presto");
			userEvent.click(screen.getByText("Done Adding Rooms"));
			expect(screen.getByText("Edit Rooms")).toBeInTheDocument();
			expect(screen.getByText("abra")).toBeInTheDocument();
			expect(screen.getByText("kadabra")).toBeInTheDocument();
			expect(screen.getByText("presto")).toBeInTheDocument();
			expect(mockLadderService.editLadder).toHaveBeenCalledWith({
				id: "123",
				draw: 0,
				name: "My Ladder",
				rooms: ["abra", "kadabra", "presto"],
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
	});

	describe("multiple divisions", () => {
		beforeEach(() => {
			// @ts-ignore
			mockUseLadder.mockReturnValue(
				new Ladder({
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
				})
			);
		});

		test("should display the ladder name", () => {
			renderLadderDisplay();
			expect(screen.getByText("My Ladder")).toBeInTheDocument();
		});

		test.skip("should display the teams in the correct order", () => {
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

		test.skip("should save rooms when inputted", () => {
			renderLadderDisplay();
			userEvent.click(screen.getAllByText("Add Rooms")[0]);
			const inputs = screen.getAllByTestId("room-input");
			userEvent.type(inputs[0], "abra");
			userEvent.type(inputs[1], "kadabra");
			userEvent.type(inputs[2], "presto");
			userEvent.click(screen.getByText("Done Adding Rooms"));
			expect(screen.getByText("Edit Rooms")).toBeInTheDocument();
			expect(screen.getByText("abra")).toBeInTheDocument();
			expect(screen.getByText("kadabra")).toBeInTheDocument();
			expect(screen.getByText("presto")).toBeInTheDocument();
			expect(mockLadderService.editLadder).toHaveBeenCalledWith({
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
						},
						rooms: ["abra", "kadabra", "presto"]
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
	});
});
