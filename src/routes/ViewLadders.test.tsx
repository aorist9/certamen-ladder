import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ViewLadders from "./ViewLadders";
import userEvent from "@testing-library/user-event";
import ladderService from "../services/ladderService";

jest.mock("../services/ladderService", () => ({
	addLadder: jest.fn(),
	getLadders: () => [
		{
			id: "123",
			divisions: 7,
			draw: 0,
			drawFollowUps: [],
			name: "The LADDER!",
			rounds: 17,
			type: 0
		}
	],
	deleteLadder: jest.fn()
}));

const renderViewLadders = () => {
	render(
		<BrowserRouter>
			<ViewLadders />
		</BrowserRouter>
	);
};

describe("View Ladders", () => {
	test("should show ladders", () => {
		renderViewLadders();
		expect(screen.getByText("The LADDER!")).toBeInTheDocument();
	});

	test("should remove ladder when the delete button is clicked", () => {
		renderViewLadders();
		const btns = screen.getAllByText("Delete");
		userEvent.click(btns[0]);
		expect(ladderService.deleteLadder).toHaveBeenCalled();
		expect(screen.queryAllByText("Delete")).toHaveLength(btns.length - 1);
	});
});
