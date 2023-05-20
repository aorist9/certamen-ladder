import React from "react";
import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import Draw from "./Draw";
import ladderService from "../services/ladderService";
import userEvent from "@testing-library/user-event";

const mockedUseNavigate = jest.fn();

jest.mock("../services/ladderService", () => ({
	addLadder: jest.fn(),
	editLadder: jest.fn(),
	getLadders: jest.fn(),
	getLadder: jest.fn()
}));
jest.mock("react-router-dom", () => ({
	...(jest.requireActual("react-router-dom") as object),
	useNavigate: () => mockedUseNavigate,
	useSearchParams: () => [{ get: () => "123" }]
}));

const renderDraw = () => {
	render(
		<HashRouter>
			<Draw />
		</HashRouter>
	);
};
describe("Draw", () => {
	describe("Old Fashioned", () => {
		beforeEach(() => {
			// @ts-ignore
			ladderService.getLadder.mockReturnValue({
				id: "123",
				draw: 0,
				name: "The LADDER!",
				rounds: 17,
				type: 0
			});
		});

		test("should instruct user to enter teams", () => {
			renderDraw();
			expect(
				screen.getByText(
					"Please enter the teams as they draw. Don't worry about putting them in order or filling up all the fields."
				)
			).toBeInTheDocument();
		});

		test("should start with 12 rows", () => {
			renderDraw();
			expect(screen.getAllByTestId("ladder-input-row")).toHaveLength(12);
		});

		test("should add 18 more rows when add rows button is clicked", () => {
			renderDraw();
			userEvent.click(screen.getByText("+ Add More Teams"));
			expect(screen.getAllByTestId("ladder-input-row")).toHaveLength(18);
		});

		test("should update the ladder and redirect to ladder page when teams are entered and generate ladder is clicked", () => {
			renderDraw();

			const letters = screen.getAllByTestId("letter-input");
			const teams = screen.getAllByTestId("team-input");

			userEvent.type(letters[0], "G");
			userEvent.type(teams[0], "Team");

			userEvent.type(letters[1], "I");
			userEvent.type(teams[1], "Teamily Team");

			userEvent.click(screen.getByText("Generate Ladder"));
			expect(ladderService.editLadder).toHaveBeenCalledWith({
				id: "123",
				draw: 0,
				name: "The LADDER!",
				rounds: 17,
				type: 0,
				teams: {
					G: "Team",
					I: "Teamily Team"
				}
			});

			expect(mockedUseNavigate).toHaveBeenCalledWith("/ladder?ladder=123");
		});
	});

	describe("Random Click", () => {
		beforeEach(() => {
			// @ts-ignore
			ladderService.getLadder.mockReturnValue({
				id: "123",
				draw: 1,
				name: "The LADDER!",
				rounds: 17,
				type: 0
			});

			jest.useRealTimers();
		});

		test("should ask how many letters there should be if click to draw is selected", () => {
			renderDraw();
			expect(
				screen.getByText(
					"How many letters should players choose from (it's okay if not all letters are picked)?"
				)
			).toBeInTheDocument();
		});

		test("should show a rotating letter in large print", () => {
			renderDraw();
			expect(screen.getByTestId("letter-display").textContent).toHaveLength(1);
		});

		test("should display a draw button", () => {
			renderDraw();
			expect(screen.getByText("Draw")).toBeInTheDocument();
		});

		test("should stop rotating the letter and provide a text box to enter the team name when the draw button is clicked", done => {
			renderDraw();
			userEvent.click(screen.getByText("Draw"));
			const letter = screen.getByTestId("letter-display").textContent;
			setTimeout(() => {
				expect(screen.getByTestId("letter-display").textContent).toEqual(
					letter
				);
				done();
			}, 51);
			expect(screen.getByText("Team Name:")).toBeInTheDocument();
			expect(screen.getByText("Save")).toBeInTheDocument();
		});

		test("should display the team name once saved", () => {
			renderDraw();
			userEvent.click(screen.getByText("Draw"));
			userEvent.type(
				screen.getByPlaceholderText(
					"Enter Your Team's Name (make sure to include Purple/Gold, A/B, if necessary)"
				),
				"Team"
			);
			userEvent.click(screen.getByText("Save"));
			expect(screen.getByText("Team")).toBeInTheDocument();
		});

		test("should show error message if less than 2 teams are added", () => {
			renderDraw();
			userEvent.click(screen.getByText("Draw"));
			userEvent.type(
				screen.getByPlaceholderText(
					"Enter Your Team's Name (make sure to include Purple/Gold, A/B, if necessary)"
				),
				"Teamily Team"
			);
			userEvent.click(screen.getByText("Save"));

			userEvent.click(screen.getByText("Generate Ladder"));
			expect(
				screen.getByText("You did not enter enough teams")
			).toBeInTheDocument();
		});

		test("should update the ladder and redirect to ladder page when teams are entered and generate ladder is clicked", async () => {
			renderDraw();
			userEvent.click(screen.getByText("Draw"));
			userEvent.type(
				screen.getByPlaceholderText(
					"Enter Your Team's Name (make sure to include Purple/Gold, A/B, if necessary)"
				),
				"Teamily Team"
			);
			userEvent.click(screen.getByText("Save"));

			await new Promise(resolve => setTimeout(resolve, 100));
			userEvent.click(screen.getByText("Draw"));
			userEvent.type(
				screen.getByPlaceholderText(
					"Enter Your Team's Name (make sure to include Purple/Gold, A/B, if necessary)"
				),
				"Team Team T-Team Team Team"
			);
			userEvent.click(screen.getByText("Save"));

			userEvent.click(screen.getByText("Generate Ladder"));
			expect(ladderService.editLadder).toHaveBeenCalledWith({
				id: "123",
				draw: 1,
				name: "The LADDER!",
				rounds: 17,
				type: 0,
				teams: expect.anything()
			});

			expect(
				// @ts-ignore
				Object.values(ladderService.editLadder.mock.calls[0][0].teams)
			).toEqual(expect.arrayContaining(["Teamily Team"]));

			expect(mockedUseNavigate).toHaveBeenCalledWith("/ladder?ladder=123");
		});
	});

	describe("Random Assign", () => {
		beforeEach(() => {
			// @ts-ignore
			ladderService.getLadder.mockReturnValue({
				id: "123",
				draw: 2,
				name: "The LADDER!",
				rounds: 17,
				type: 0
			});
		});

		test("should show instructions on entering teams", () => {
			renderDraw();
			expect(
				screen.getByText(
					"Please enter team names in the text box. You can separate them with commas or new lines."
				)
			).toBeInTheDocument();
		});

		test("should update the ladder and redirect to ladder page when teams are entered and generate ladder is clicked", () => {
			renderDraw();
			userEvent.type(
				screen.getByPlaceholderText("Enter teams here"),
				"Team, Teamy\nTeamily, Team team"
			);
			userEvent.click(screen.getByText("Generate Ladder"));
			expect(ladderService.editLadder).toHaveBeenCalledWith({
				id: "123",
				draw: 2,
				name: "The LADDER!",
				rounds: 17,
				type: 0,
				teams: expect.anything()
			});

			expect(
				// @ts-ignore
				Object.values(ladderService.editLadder.mock.calls[0][0].teams)
			).toEqual(
				expect.arrayContaining(["Team", "Teamy", "Teamily", "Team team"])
			);

			expect(mockedUseNavigate).toHaveBeenCalledWith("/ladder?ladder=123");
		});
	});

	describe("Multiple Divisions", () => {
		beforeEach(() => {
			// @ts-ignore
			ladderService.getLadder.mockReturnValue({
				id: "123",
				divisions: 3,
				draw: 2,
				name: "The LADDER!",
				rounds: 17,
				type: 0
			});
		});

		test("should show instructions on entering teams", () => {
			renderDraw();
			expect(
				screen.getAllByText(
					"Please enter team names in the text box. You can separate them with commas or new lines."
				)
			).toHaveLength(3);
		});

		test("should update the ladder and redirect to ladder page when teams are entered and generate ladder is clicked", () => {
			renderDraw();
			const textAreas: HTMLElement[] =
				screen.getAllByPlaceholderText("Enter teams here");
			userEvent.type(textAreas[0], "Team, Teamy\nTeamily, Team team");
			userEvent.type(textAreas[1], "A, B\nY, G");
			userEvent.type(textAreas[2], "X, Y, Z");
			userEvent.click(screen.getByText("Generate Ladder"));
			expect(ladderService.editLadder).toHaveBeenCalledWith({
				id: "123",
				divisions: 3,
				draw: 2,
				name: "The LADDER!",
				rounds: 17,
				type: 0,
				teams: expect.anything()
			});

			expect(
				// @ts-ignore
				Object.values(ladderService.editLadder.mock.calls[0][0].teams)
			).toHaveLength(3);
			expect(mockedUseNavigate).toHaveBeenCalledWith("/ladder?ladder=123");
		});
	});
});
