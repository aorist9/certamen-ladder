import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChooseDraw from "../components/Draw/ChooseDraw";
import ladderService from "../services/ladderService";
import OldFashionedDraw from "../components/Draw/OldFashionedDraw";
import RandomDraw from "../components/Draw/RandomDraw";
import LadderType from "../types/LadderType";
import "./Draw.css";
import DivisionTab from "../components/Draw/DivisionTab";
import AddRooms from "../components/Draw/AddRooms";
import Teams from "../types/Teams";

const determineInitialDivisions = (divisions: number): string[] => {
	const basicDivisions = [
		"Middle School",
		"Novice",
		"Intermediate",
		"Advanced"
	];
	if (divisions <= 4) {
		return basicDivisions.slice(4 - divisions);
	} else {
		let result = [...basicDivisions];
		for (let i = 4; i < divisions; i++) {
			result.push("Division " + (i + 1));
		}
		return result;
	}
};

type DrawFunction = () => { [letter: string]: string };

export type DrawProps = {
	setDrawFunction: (func: DrawFunction) => void;
	error?: string;
	teams?: Record<string, string>;
};

const Draw = () => {
	const [selectedDivision, setSelectedDivision] = useState<number>(0);
	const [query] = useSearchParams();
	const navigate = useNavigate();
	const ladder: LadderType | undefined = ladderService.getLadder(
		query.get("ladder") || ""
	);
	const [divisionNames, setDivisionNames] = useState<string[]>(
		ladder?.divisions ? determineInitialDivisions(ladder.divisions) : []
	);
	const [error, setError] = useState<
		{ idx: number; message: string } | undefined
	>();

	const defaultDrawFunction = (idx: number) => (): Teams => {
		if (ladder?.divisions && ladder?.divisions > 1) {
			// @ts-ignore
			return ladder?.teams?.[idx].teams || {};
		} else if (ladder?.teams) {
			return ladder?.teams as Teams;
		} else {
			return {};
		}
	};
	const initialDrawFunctions: DrawFunction[] = [defaultDrawFunction(0)];
	if (ladder?.divisions) {
		for (let i = 1; i < ladder?.divisions; i++) {
			initialDrawFunctions.push(defaultDrawFunction(i));
		}
	}
	const [drawFunctions, setDrawFunctions] =
		useState<DrawFunction[]>(initialDrawFunctions);

	if (!ladder) {
		return (
			<section className="App-page draw">
				You may have reached this page in error
			</section>
		);
	}

	const submit = () => {
		let newLadder: LadderType = { ...ladder };
		try {
			if (divisionNames.length) {
				newLadder.teams = divisionNames.map((name, idx) => {
					try {
						const teams = drawFunctions[idx]();
						if (Object.keys(teams).length < 2) {
							throw new Error("You did not enter enough teams");
						}
						return {
							division: name,
							teams,
							rooms:
								ladder?.teams && Array.isArray(ladder?.teams)
									? ladder.teams[idx]?.rooms
									: []
						};
					} catch (err) {
						// @ts-ignore
						setError({ idx, message: err.message });
						setSelectedDivision(idx);
						throw err;
					}
				});
			} else {
				try {
					newLadder.teams = drawFunctions[0]();
					if (Object.keys(newLadder.teams).length < 2) {
						throw new Error("You did not enter enough teams");
					}
				} catch (err) {
					// @ts-ignore
					setError({ idx: 0, message: err.message });
					throw err;
				}
			}
			ladderService.editLadder(newLadder);
			navigate(`/ladder?ladder=${query.get("ladder")}`);
		} catch (err) {
			console.log("error while generating ladder", err);
		}
	};

	const renderDraw = (idx: number) => {
		const teams: Record<string, string> | undefined =
			ladder.divisions && ladder.divisions > 1
				? // @ts-ignore
				  ladder?.teams?.[idx]?.teams || []
				: ladder.teams;
		const inputDrawFunction = (func: DrawFunction) => {
			let newDrawFunctions = [...drawFunctions];
			newDrawFunctions[idx] = func;
			setDrawFunctions(newDrawFunctions);
		};

		const updateRooms = (rooms: string[]) => {
			if (ladder?.divisions && ladder.divisions > 1) {
				const newLadder = { ...ladder };
				if (
					!newLadder.teams ||
					!Array.isArray(newLadder.teams) ||
					newLadder.teams.length < idx
				) {
					newLadder.teams = divisionNames.map(division => ({
						division,
						teams: {}
					}));
				}
				newLadder.teams[idx].rooms = rooms;
				ladderService.editLadder(newLadder);
			} else {
				ladderService.editLadder({ ...ladder, rooms });
			}
		};

		const savedRooms =
			ladder.rooms ||
			(ladder.teams &&
				Array.isArray(ladder.teams) &&
				ladder.teams[idx].rooms) ||
			[];
		switch (ladder?.draw) {
			case 0: // old fashioned
				return (
					<section className="draw-division">
						<OldFashionedDraw
							setDrawFunction={inputDrawFunction}
							teams={teams}
						/>
						<AddRooms
							divisionOrTournament={
								ladder.divisions && ladder.divisions > 1
									? "division"
									: "tournament"
							}
							savedRooms={savedRooms}
							updateRooms={updateRooms}
						/>
					</section>
				);
			case 1: // virtual choose
				return (
					<section className="draw-division">
						<ChooseDraw setDrawFunction={inputDrawFunction} teams={teams} />
						<AddRooms
							divisionOrTournament={
								ladder.divisions && ladder.divisions > 1
									? "division"
									: "tournament"
							}
							savedRooms={savedRooms}
							updateRooms={updateRooms}
						/>
					</section>
				);
			case 2: // random assignment
				return (
					<section className="draw-division">
						<RandomDraw setDrawFunction={inputDrawFunction} teams={teams} />
						<AddRooms
							divisionOrTournament={
								ladder.divisions && ladder.divisions > 1
									? "division"
									: "tournament"
							}
							savedRooms={savedRooms}
							updateRooms={updateRooms}
						/>
					</section>
				);
			default:
				return (
					<section className="App-page draw">
						You may have reached this page in error
					</section>
				);
		}
	};

	return (
		<section>
			{ladder.divisions && ladder.divisions > 1 ? (
				<nav className="divisions tabs">
					<ul>
						{divisionNames.map((name, idx) => (
							<DivisionTab
								key={name}
								changeName={(name: string) =>
									setDivisionNames([
										...divisionNames.slice(0, idx),
										name,
										...divisionNames.slice(idx + 1)
									])
								}
								isSelected={selectedDivision === idx}
								name={name}
								select={() => setSelectedDivision(idx)}
							/>
						))}
					</ul>
				</nav>
			) : (
				""
			)}
			<section className="App-page draw">
				{divisionNames?.length ? (
					divisionNames.map((divName, idx: number) => (
						<section
							key={divName}
							style={selectedDivision === idx ? {} : { display: "none" }}
						>
							{error?.idx === idx ? (
								<p className="error">{error?.message}</p>
							) : (
								""
							)}
							{renderDraw(idx)}
						</section>
					))
				) : (
					<>
						{error?.message ? <p className="error">{error?.message}</p> : ""}
						{renderDraw(0)}
					</>
				)}
				<button style={{ marginTop: "1em" }} onClick={() => submit()}>
					Generate Ladder
				</button>
			</section>
		</section>
	);
};

export default Draw;
