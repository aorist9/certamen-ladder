import React, { useEffect, useState } from "react";
import NumberInput from "../NumberInput";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { letters } from "../../constants";
import { DrawProps } from "../../routes/Draw";
import ChooseDrawTeamsSection from "./ChooseDrawTeamsSection";
import ChooseDrawTeamInput from "./ChooseDrawTeamInput";

const Draw = (props: DrawProps) => {
	const [numLetters, setNumLetters] = useState<number | undefined>(15);
	const [displayLetter, setDisplayLetter] = useState<string>("A");
	const [chosenLetter, setChosenLetter] = useState<string | undefined>();
	const [teams, setTeams] = useState<{ [key: string]: string }>(
		props.teams || {}
	);

	useEffect(() => {
		props.setDrawFunction(() => teams);
		// eslint-disable-next-line
	}, [teams]);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		let lettersToChooseFrom: string[] = letters
			.slice(0, numLetters)
			.filter((letter: string) => !Object.keys(teams).includes(letter));

		const rotate = () => {
			timeout = setTimeout(() => {
				if (numLetters) {
					setDisplayLetter(
						lettersToChooseFrom[
							Math.floor(Math.random() * lettersToChooseFrom.length)
						]
					);
				} else {
					setDisplayLetter("A");
				}

				if (!chosenLetter) {
					rotate();
				}
			}, 50);
		};
		rotate();

		return () => clearTimeout(timeout);
	}, [chosenLetter, numLetters, teams]);

	return (
		<Stack className="draw-body" direction="column" spacing={2}>
			<Box component="section">
				<NumberInput
					id="number-of-letters"
					label="How many letters should players choose from (it's okay if not all letters are picked)?"
					onValueChange={(value: number | null) =>
						value && setNumLetters(value)
					}
					maxWidth="350px"
					value={numLetters}
				/>
			</Box>
			<Stack className="draw-section">
				<Box
					component="figure"
					data-testid="letter-display"
					sx={{
						mb: 2,
						p: 2,
						borderRadius: 2,
						bgcolor: "action.hover",
						display: "inline-block",
						fontSize: "8rem",
						fontWeight: 700,
						minWidth: 72,
						textAlign: "center"
					}}
				>
					{chosenLetter || displayLetter}
				</Box>
				{chosenLetter ? (
					<ChooseDrawTeamInput
						addTeam={(teamName: string) => {
							setTeams({
								...teams,
								[chosenLetter]: teamName
							});
							setChosenLetter(undefined);
						}}
					/>
				) : (
					<Button
						variant="contained"
						onClick={() => {
							setChosenLetter(displayLetter);
						}}
						sx={{ mb: 4 }}
					>
						Draw
					</Button>
				)}
			</Stack>
			{Object.keys(teams).length ? (
				<ChooseDrawTeamsSection
					teams={teams}
					removeTeam={(letter: string) => {
						let newTeams = { ...teams };
						delete newTeams[letter];
						setTeams(newTeams);
					}}
				/>
			) : (
				""
			)}
			{Object.keys(teams).length === 6 && (
				<FormControlLabel
					control={
						<Checkbox
							id="three-rooms-for-six-teams"
							checked={props.threeRooms}
							onChange={e => props.setThreeRooms(e.target.checked)}
						/>
					}
					label="Separate these six teams into 3 rooms?"
				/>
			)}
		</Stack>
	);
};

export default Draw;
