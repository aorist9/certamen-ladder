import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import ScoreboardPage from "./ScoreboardPage";
import { useLadder } from "../services/ladderService";
import { Ladder } from "../types/LadderType";

jest.mock("../services/ladderService");
const mockUseLadder = jest.mocked(useLadder);

jest.mock("react-router-dom", () => ({
	...(jest.requireActual("react-router-dom") as object),
	useSearchParams: () => [{ get: () => "123" }]
}));

const renderScoreboard = () => {
	render(
		<HashRouter>
			<ScoreboardPage />
		</HashRouter>
	);
};

describe("Scoreboard", () => {
	describe("Single Division", () => {
		beforeEach(() => {
			// @ts-ignore
			mockUseLadder.mockReturnValue(
				new Ladder({
					id: "123",
					draw: 0,
					name: "My Ladder",
					rounds: 3,
					type: 0,
					teams: {
						G: "C",
						B: "D",
						A: "A",
						C: "B"
					},
					matches: [
						[
							[
								{ team: "A", score: 50 },
								{ team: "B", score: 25 }
							],
							[
								{ team: "C", score: 150 },
								{ team: "D", score: 35 }
							]
						],
						[
							[
								{ team: "A", score: 50 },
								{ team: "C", score: 25 }
							],
							[
								{ team: "B", score: 150 },
								{ team: "D", score: 35 }
							]
						],
						[
							[
								{ team: "A", score: 50 },
								{ team: "D", score: 25 }
							],
							[
								{ team: "B", score: 150 },
								{ team: "C", score: 35 }
							]
						]
					]
				})
			);
		});

		test("should show ladder name", () => {
			renderScoreboard();
			expect(screen.getByText("My Ladder")).toBeInTheDocument();
		});

		test("should calculate scores correctly", () => {
			renderScoreboard();
			const teamCells = screen.getAllByTestId("team-cell");
			const firstRoundScoreCells = screen.getAllByTestId("round-1-score-cell");
			const secondRoundScoreCells = screen.getAllByTestId("round-2-score-cell");
			const thirdRoundScoreCells = screen.getAllByTestId("round-3-score-cell");
			const totalScoreCells = screen.getAllByTestId("total-score-cell");

			expect(teamCells[0].textContent).toEqual("B");
			expect(firstRoundScoreCells[0].textContent).toEqual("25");
			expect(secondRoundScoreCells[0].textContent).toEqual("150");
			expect(thirdRoundScoreCells[0].textContent).toEqual("150");
			expect(totalScoreCells[0].textContent).toEqual("325");

			expect(teamCells[1].textContent).toEqual("C");
			expect(firstRoundScoreCells[1].textContent).toEqual("150");
			expect(secondRoundScoreCells[1].textContent).toEqual("25");
			expect(thirdRoundScoreCells[1].textContent).toEqual("35");
			expect(totalScoreCells[1].textContent).toEqual("210");

			expect(teamCells[2].textContent).toEqual("A");
			expect(firstRoundScoreCells[2].textContent).toEqual("50");
			expect(secondRoundScoreCells[2].textContent).toEqual("50");
			expect(thirdRoundScoreCells[2].textContent).toEqual("50");
			expect(totalScoreCells[2].textContent).toEqual("150");

			expect(teamCells[3].textContent).toEqual("D");
			expect(firstRoundScoreCells[3].textContent).toEqual("35");
			expect(secondRoundScoreCells[3].textContent).toEqual("35");
			expect(thirdRoundScoreCells[3].textContent).toEqual("25");
			expect(totalScoreCells[3].textContent).toEqual("95");
		});
	});

	describe("Multiple Divisions", () => {
		beforeEach(() => {
			// @ts-ignore
			mockUseLadder.mockReturnValue(
				new Ladder({
					id: "123",
					draw: 0,
					name: "My Ladder",
					divisions: 2,
					rounds: 3,
					type: 0,
					teams: [
						{
							division: "Novice",
							teams: {
								G: "C",
								B: "D",
								A: "A",
								C: "B"
							},
							matches: [
								[
									[
										{ team: "A", score: 50 },
										{ team: "B", score: 25 }
									],
									[
										{ team: "C", score: 150 },
										{ team: "D", score: 35 }
									]
								],
								[
									[
										{ team: "A", score: 50 },
										{ team: "C", score: 25 }
									],
									[
										{ team: "B", score: 150 },
										{ team: "D", score: 35 }
									]
								],
								[
									[
										{ team: "A", score: 50 },
										{ team: "D", score: 25 }
									],
									[
										{ team: "B", score: 150 },
										{ team: "C", score: 35 }
									]
								]
							]
						},
						{
							division: "Advanced",
							teams: { A: "Z", B: "Y" },
							matches: [
								[
									[
										{ team: "Z", score: 10 },
										{ team: "Y", score: 15 }
									]
								],
								[
									[
										{ team: "Z", score: 100 },
										{ team: "Y", score: 25 }
									]
								],
								[
									[
										{ team: "Z", score: 20 },
										{ team: "Y", score: 35 }
									]
								]
							]
						}
					]
				})
			);
		});

		test("should show ladder and division names", () => {
			renderScoreboard();
			expect(screen.getByText("My Ladder")).toBeInTheDocument();
			expect(screen.getByText("Novice")).toBeInTheDocument();
			expect(screen.getByText("Advanced")).toBeInTheDocument();
		});

		test("should calculate scores correctly", () => {
			renderScoreboard();
			const teamCells = screen.getAllByTestId("team-cell");
			const firstRoundScoreCells = screen.getAllByTestId("round-1-score-cell");
			const secondRoundScoreCells = screen.getAllByTestId("round-2-score-cell");
			const thirdRoundScoreCells = screen.getAllByTestId("round-3-score-cell");
			const totalScoreCells = screen.getAllByTestId("total-score-cell");

			expect(teamCells[0].textContent).toEqual("B");
			expect(firstRoundScoreCells[0].textContent).toEqual("25");
			expect(secondRoundScoreCells[0].textContent).toEqual("150");
			expect(thirdRoundScoreCells[0].textContent).toEqual("150");
			expect(totalScoreCells[0].textContent).toEqual("325");

			expect(teamCells[1].textContent).toEqual("C");
			expect(firstRoundScoreCells[1].textContent).toEqual("150");
			expect(secondRoundScoreCells[1].textContent).toEqual("25");
			expect(thirdRoundScoreCells[1].textContent).toEqual("35");
			expect(totalScoreCells[1].textContent).toEqual("210");

			expect(teamCells[2].textContent).toEqual("A");
			expect(firstRoundScoreCells[2].textContent).toEqual("50");
			expect(secondRoundScoreCells[2].textContent).toEqual("50");
			expect(thirdRoundScoreCells[2].textContent).toEqual("50");
			expect(totalScoreCells[2].textContent).toEqual("150");

			expect(teamCells[3].textContent).toEqual("D");
			expect(firstRoundScoreCells[3].textContent).toEqual("35");
			expect(secondRoundScoreCells[3].textContent).toEqual("35");
			expect(thirdRoundScoreCells[3].textContent).toEqual("25");
			expect(totalScoreCells[3].textContent).toEqual("95");

			expect(teamCells[4].textContent).toEqual("Z");
			expect(firstRoundScoreCells[4].textContent).toEqual("10");
			expect(secondRoundScoreCells[4].textContent).toEqual("100");
			expect(thirdRoundScoreCells[4].textContent).toEqual("20");
			expect(totalScoreCells[4].textContent).toEqual("130");

			expect(teamCells[5].textContent).toEqual("Y");
			expect(firstRoundScoreCells[5].textContent).toEqual("15");
			expect(secondRoundScoreCells[5].textContent).toEqual("25");
			expect(thirdRoundScoreCells[5].textContent).toEqual("35");
			expect(totalScoreCells[5].textContent).toEqual("75");
		});
	});
});
