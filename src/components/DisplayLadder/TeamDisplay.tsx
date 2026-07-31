import React, { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { EditingStatus } from "./DisplayedLadder";

type TeamDisplayProps = {
	onScoreChange: (e: ChangeEvent<HTMLInputElement>) => void;
	roundEditStatus: EditingStatus;
	score: number | undefined;
	swissPoints?: number;
	team: string;
};

const TeamDisplay = (props: TeamDisplayProps) => {
	return (
		<ListItem disablePadding sx={{ py: 0.25 }}>
			{props.roundEditStatus === EditingStatus.EDITING ||
			props.score !== undefined ? (
				<Stack
					direction="row"
					spacing={1}
					sx={{ width: "100%", alignItems: "center" }}
				>
					<Typography variant="body2" color="text.primary">
						{props.team}
					</Typography>
					<Box>
						{props.roundEditStatus === EditingStatus.EDITING ? (
							<TextField
								type="number"
								slotProps={{ htmlInput: { step: 5 } }}
								value={props.score || 0}
								onChange={props.onScoreChange}
								size="small"
								sx={{ width: 96 }}
							/>
						) : (
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								{`${props.score}${
									props.swissPoints ? ` / ${props.swissPoints}` : ""
								}`}
							</Typography>
						)}
					</Box>
				</Stack>
			) : (
				<Typography variant="body2" color="text.primary">
					{props.team}
				</Typography>
			)}
		</ListItem>
	);
};

export default TeamDisplay;
