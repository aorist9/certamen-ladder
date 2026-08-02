import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChooseDraw from "../components/Draw/ChooseDraw";
import ladderService from "../services/ladderService";
import OldFashionedDraw from "../components/Draw/OldFashionedDraw";
import RandomDraw from "../components/Draw/RandomDraw";
import { Ladder } from "../types/LadderType";
import DivisionTab from "../components/Draw/DivisionTab";
import AddRooms from "../components/Draw/AddRooms";
import Teams from "../types/Teams";
import { DrawType } from "../constants";
import { Grid } from "@mui/material";

const determineInitialDivisions = (divisions: number | undefined): string[] => {
	if (!divisions) {
		return [];
	}

	const basicDivisions = [
		"Middle School",
		"Novice",
		"Intermediate",
		"Advanced"
	];
	if (divisions === 1) {
		return [""];
	} else if (divisions <= 4) {
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
	threeRooms: boolean;
	setThreeRooms: (tr: boolean) => void;
};

const Draw = () => {
	const [selectedDivision, setSelectedDivision] = useState<number>(0);
	const [query] = useSearchParams();
	const navigate = useNavigate();
	const ladder: Ladder | undefined = ladderService.getLadder(
		query.get("ladder") || ""
	);
	const [divisionNames, setDivisionNames] = useState<string[]>(
		determineInitialDivisions(ladder?.divisions?.length)
	);
	const defaultThreeRooms: boolean | boolean[] = ladder?.divisions ? [] : false;
	if (ladder?.divisions && Array.isArray(defaultThreeRooms)) {
		for (let i = 0; i < ladder?.divisions?.length; i++) {
			defaultThreeRooms.push(false);
		}
	}
	const [threeRooms, setThreeRooms] = useState<boolean | boolean[]>(
		defaultThreeRooms
	);
	const [error, setError] = useState<
		{ idx: number; message: string } | undefined
	>();

	const defaultDrawFunction = (idx: number) => (): Teams => {
		return ladder?.divisions?.[idx]?.teams || {};
	};

	const initialDrawFunctions: DrawFunction[] =
		ladder?.divisions?.map((_, idx) => defaultDrawFunction(idx)) || [];
	const [drawFunctions, setDrawFunctions] =
		useState<DrawFunction[]>(initialDrawFunctions);

	if (!ladder) {
		return (
			<Box component="section" sx={{ p: 3 }}>
				<Typography>You may have reached this page in error</Typography>
			</Box>
		);
	}

	const submit = () => {
		try {
			ladder.divisions = ladder?.divisions?.map((division, idx) => {
				try {
					const teams = drawFunctions[idx]();
					if (Object.keys(teams).length < 2) {
						throw new Error("You did not enter enough teams");
					}
					return {
						division:
							divisionNames.length > idx ? divisionNames[idx] : undefined,
						teams,
						threeRooms:
							Object.keys(teams).length === 6 && (threeRooms as boolean[])[idx],
						rooms: division?.rooms || []
					};
				} catch (err) {
					// @ts-ignore
					setError({ idx, message: err.message });
					setSelectedDivision(idx);
					throw err;
				}
			});
			ladderService.editLadder(ladder);
			navigate(`/ladder?ladder=${query.get("ladder")}`);
		} catch (err) {
			console.log("error while generating ladder", err);
		}
	};

	const renderDraw = (idx: number) => {
		const teams: Record<string, string> | undefined =
			ladder?.divisions?.[idx]?.teams || {};
		const inputDrawFunction = (func: DrawFunction) => {
			let newDrawFunctions = [...drawFunctions];
			newDrawFunctions[idx] = func;
			setDrawFunctions(newDrawFunctions);
		};

		const updateRooms = (rooms: string[]) => {
			ladder.divisions = divisionNames.map(division => ({
				division,
				teams: {}
			}));
			if (ladder?.divisions?.[idx]) {
				ladder.divisions[idx].rooms = rooms;
			}
			ladderService.editLadder(ladder);
		};

		const savedRooms = ladder?.divisions?.[idx]?.rooms || [];
		switch (ladder?.drawType) {
			case DrawType.TRADITIONAL:
				return (
					<Grid container spacing={2} className="draw-division">
						<Grid component="section" size={{ xs: 12, md: 8, lg: 9 }}>
							<OldFashionedDraw
								setDrawFunction={inputDrawFunction}
								teams={teams}
								threeRooms={
									Array.isArray(threeRooms) ? threeRooms[idx] : threeRooms
								}
								setThreeRooms={
									Array.isArray(threeRooms)
										? (tr: boolean) => {
												setThreeRooms([
													...threeRooms.slice(0, idx),
													tr,
													...threeRooms.slice(idx + 1)
												]);
											}
										: setThreeRooms
								}
							/>
						</Grid>
						<Grid component="section" size={{ xs: 12, md: 4, lg: 3 }}>
							<AddRooms
								divisionOrTournament={
									ladder?.divisions && ladder.divisions.length > 1
										? "division"
										: "tournament"
								}
								savedRooms={savedRooms}
								updateRooms={updateRooms}
							/>
						</Grid>
					</Grid>
				);
			case DrawType.CLICK:
				return (
					<Grid container spacing={2} className="draw-division">
						<Grid component="section" size={{ xs: 12, md: 8, lg: 9 }}>
							<ChooseDraw
								setDrawFunction={inputDrawFunction}
								teams={teams}
								threeRooms={
									Array.isArray(threeRooms) ? threeRooms[idx] : threeRooms
								}
								setThreeRooms={
									Array.isArray(threeRooms)
										? (tr: boolean) => {
												setThreeRooms([
													...threeRooms.slice(0, idx),
													tr,
													...threeRooms.slice(idx + 1)
												]);
											}
										: setThreeRooms
								}
							/>
						</Grid>
						<Grid component="section" size={{ xs: 12, md: 4, lg: 3 }}>
							<AddRooms
								divisionOrTournament={
									ladder?.divisions && ladder.divisions.length > 1
										? "division"
										: "tournament"
								}
								savedRooms={savedRooms}
								updateRooms={updateRooms}
							/>
						</Grid>
					</Grid>
				);
			case DrawType.RANDOM:
				return (
					<Grid container spacing={2} className="draw-division">
						<Grid component="section" size={{ xs: 12, md: 8, lg: 9 }}>
							<RandomDraw
								setDrawFunction={inputDrawFunction}
								teams={teams}
								threeRooms={
									Array.isArray(threeRooms) ? threeRooms[idx] : threeRooms
								}
								setThreeRooms={
									Array.isArray(threeRooms)
										? (tr: boolean) => {
												setThreeRooms([
													...threeRooms.slice(0, idx),
													tr,
													...threeRooms.slice(idx + 1)
												]);
											}
										: setThreeRooms
								}
							/>
						</Grid>
						<Grid component="section" size={{ xs: 12, md: 4, lg: 3 }}>
							<AddRooms
								divisionOrTournament={
									ladder?.divisions && ladder.divisions.length > 1
										? "division"
										: "tournament"
								}
								savedRooms={savedRooms}
								updateRooms={updateRooms}
							/>
						</Grid>
					</Grid>
				);
			default:
				return (
					<Box component="section" sx={{ p: 3 }}>
						<Typography>You may have reached this page in error</Typography>
					</Box>
				);
		}
	};

	return (
		<Box component="section" sx={{ display: "grid", gap: 2 }}>
			{ladder.divisions && ladder.divisions.length > 1 ? (
				<Box
					component="nav"
					sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
				>
					<Tabs
						value={selectedDivision}
						variant="scrollable"
						scrollButtons="auto"
					>
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
								idx={idx}
								name={name}
								select={() => setSelectedDivision(idx)}
							/>
						))}
					</Tabs>
				</Box>
			) : null}
			<Paper
				elevation={0}
				sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}
			>
				{divisionNames?.length ? (
					divisionNames.map((divName, idx: number) => (
						<Box
							key={divName}
							sx={selectedDivision === idx ? {} : { display: "none" }}
						>
							{error?.idx === idx ? (
								<Typography color="error" sx={{ mb: 2 }}>
									{error?.message}
								</Typography>
							) : null}
							{renderDraw(idx)}
						</Box>
					))
				) : (
					<>
						{error?.message ? (
							<Typography color="error" sx={{ mb: 2 }}>
								{error?.message}
							</Typography>
						) : null}
						{renderDraw(0)}
					</>
				)}
				<Button variant="contained" sx={{ mt: 2 }} onClick={() => submit()}>
					Generate Ladder
				</Button>
			</Paper>
		</Box>
	);
};

export default Draw;
