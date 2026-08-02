import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const ChooseDrawTeamInput = (props: {
	addTeam: (teamName: string) => void;
}) => {
	const [teamName, setTeamName] = useState<string | undefined>();

	useEffect(() => {
		document.getElementById("team-name")?.focus();
	}, []);

	return (
		<Box
			component="form"
			onSubmit={(e: FormEvent) => {
				e.preventDefault();
				if (teamName) {
					props.addTeam(teamName);
					setTeamName("");
				}
			}}
			sx={{ width: "100%" }}
		>
			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={1.5}
				sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}
			>
				<TextField
					label="Team Name:"
					id="team-name"
					value={teamName || ""}
					fullWidth
					placeholder="Enter Your Team's Name (make sure to include Purple/Gold, A/B, if necessary)"
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setTeamName(e.target.value)
					}
				/>
				<Button type="submit" variant="contained" disabled={!teamName?.trim()}>
					Save
				</Button>
			</Stack>
		</Box>
	);
};

export default ChooseDrawTeamInput;
