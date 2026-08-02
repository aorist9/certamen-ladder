import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DrawProps } from "../../routes/Draw";
import { letters } from "../../constants";

const mapTeamsToObject = (
	splitTeams: string[],
	availableLetters: string[]
): { [letter: string]: string } => {
	return splitTeams.reduce(
		(acc: { [letter: string]: string }, team: string) => {
			const idx = Math.floor(Math.random() * availableLetters.length);
			const letter = availableLetters[idx];
			availableLetters.splice(idx, 1);
			acc[letter] = team;
			return acc;
		},
		{}
	);
};

const RandomDraw = (props: DrawProps) => {
	const [teams, setTeams] = useState<string>(
		props.teams ? Object.values(props.teams).join("\n") : ""
	);
	const splitTeams = useMemo<string[]>(
		() => teams.split(/\s*[,\n]\s*/),
		[teams]
	);
	useEffect(() => {
		props.setDrawFunction(() => {
			let availableLetters = letters.slice(0, splitTeams.length);
			return mapTeamsToObject(splitTeams, availableLetters);
		});
		// eslint-disable-next-line
	}, [splitTeams]);

	return (
		<Box component="section" sx={{ display: "grid", gap: 2 }}>
			<Typography variant="body1">
				Please enter team names in the text box. You can separate them with
				commas or new lines.
			</Typography>
			<Stack spacing={1.5}>
				<TextField
					multiline
					minRows={8}
					value={teams}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setTeams(e.target.value)
					}
					placeholder="Enter teams here"
					sx={{ width: "100%", maxWidth: 560 }}
				/>
				{Object.keys(splitTeams).length === 6 && (
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
		</Box>
	);
};

export default RandomDraw;
