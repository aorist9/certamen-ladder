import React from "react";
import { HashRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateLadder from "./CreateLadder";
import ladderService from "../services/ladderService";
import { Ladder } from "../types/LadderType";

const mockedUseNavigate = jest.fn();

jest.mock("../services/ladderService");
jest.mock("react-router-dom", () => ({
	...(jest.requireActual("react-router-dom") as any),
	useNavigate: () => mockedUseNavigate
}));

const renderCreateLadder = () =>
	render(
		<HashRouter>
			<CreateLadder />
		</HashRouter>
	);

describe("CreateLadder", () => {
	test("should ask for a name for the ladder", () => {
		renderCreateLadder();
		expect(screen.getByText("Ladder Name:")).toBeInTheDocument();
	});

	test("should ask if there are multiple divisions", () => {
		renderCreateLadder();
		userEvent.click(screen.getByLabelText("Multiple Division Tournament"));
		expect(
			screen.getByText("How many divisions are there?")
		).toBeInTheDocument();
	});

	test("should ask for a ladder type", () => {
		renderCreateLadder();
		expect(
			screen.getByText("What type of ladder would you like to create?")
		).toBeInTheDocument();
	});

	test("should ask how many rounds", () => {
		renderCreateLadder();
		expect(
			screen.getByText("How many preliminary rounds are you playing?")
		).toBeInTheDocument();
	});

	test("should ask about the draw", () => {
		renderCreateLadder();
		expect(
			screen.getByText("How would you like to do the draw?")
		).toBeInTheDocument();
		expect(
			screen.getByText("I wanna use scraps of paper like my ancestors did")
		).toBeInTheDocument();
		expect(
			screen.getByText("Have teams click a button to draw a letter")
		).toBeInTheDocument();
		expect(
			screen.getByText("Just assign teams a letter randomly")
		).toBeInTheDocument();
	});

	test("Start button should be disabled if not all required fields are filled", () => {
		renderCreateLadder();
		const button = screen.getByText("Start");
		expect(button).toBeDisabled();
		userEvent.type(screen.getByLabelText("Ladder Name:"), "test");
		expect(button).toBeDisabled();
		userEvent.click(
			screen.getByLabelText("Just assign teams a letter randomly")
		);
		expect(button).not.toBeDisabled();
	});

	test("should store the ladder in local storage and redirect to draw page when the form is filled out and submitted", () => {
		renderCreateLadder();
		const button = screen.getByText("Start");
		userEvent.type(screen.getByLabelText("Ladder Name:"), "test");
		userEvent.click(
			screen.getByLabelText("Just assign teams a letter randomly")
		);
		userEvent.click(button);

		expect(ladderService.addLadder).toHaveBeenCalled();

		expect(mockedUseNavigate).toHaveBeenCalledWith(
			expect.stringContaining("/draw?ladder=")
		);
	});
});
