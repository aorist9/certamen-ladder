import React from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRoundContext } from "../../contexts/RoundContext";
import { NOT_A_TEAM } from "../../constants";

const UP_ARROW = "\u2191";
const DOWN_ARROW = "\u2193";

const TeamDisplay = ({
	addPlayers,
	letter,
	moveDown,
	moveUp,
	team
}: {
	addPlayers: VoidFunction;
	letter: "A" | "B" | "C" | "D";
	moveDown?: VoidFunction;
	moveUp?: VoidFunction;
	team: string;
}) => {
	const { isEditMode } = useRoundContext();
	const theme = useTheme();

	return (
		<ListItem
			className={`team-select-item ${team === NOT_A_TEAM.name ? "hide-print" : ""}`}
			sx={{
				[theme.breakpoints.down("sm")]: { width: "80%", border: "1px solid" },
				[theme.breakpoints.up("sm")]: { width: "60%", border: "1px solid" }
			}}
		>
			<Stack
				direction="row"
				id={`team-${letter}-select`}
				className="team-assignment"
				sx={{
					justifyContent: "space-between",
					alignItems: "center",
					width: "80%",
					height: "100%"
				}}
			>
				<Stack
					direction="row"
					sx={{ alignItems: "center", gap: "0.5rem", height: "100%" }}
				>
					<Typography variant="body1">Team {letter}</Typography>
					<Divider
						orientation="vertical"
						flexItem
						className="hide-print"
						sx={{ borderRight: "1.5px solid" }}
					/>
				</Stack>
				{team}
				{isEditMode && (
					<Stack direction="column" className="button-section">
						<Button
							variant="outlined"
							sx={{ fontSize: "1.5rem" }}
							disabled={!moveUp}
							className="direction-button hide-print"
							onClick={moveUp}
						>
							{UP_ARROW}
						</Button>
						<Button
							variant="outlined"
							sx={{ fontSize: "1.5rem" }}
							disabled={!moveDown}
							className="direction-button hide-print"
							onClick={moveDown}
						>
							{DOWN_ARROW}
						</Button>
					</Stack>
				)}
			</Stack>
			{isEditMode && team !== NOT_A_TEAM.name && (
				<Button
					variant="contained"
					className="btn-info hide-print"
					onClick={addPlayers}
				>
					Add Players
				</Button>
			)}
		</ListItem>
	);
};

export default TeamDisplay;
