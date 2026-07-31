import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Ladder, LadderStatus } from "../types/LadderType";
import DataDisplay from "./DataDisplay";

const LadderInfoSection = (props: { ladder: Ladder }) => {
	const ladder: Ladder = new Ladder(props.ladder);
	const status: LadderStatus = ladder.calculateStatus();
	return (
		<Paper
			variant="outlined"
			sx={{
				p: { xs: 2, md: 3 },
				bgcolor: "background.paper",
				borderColor: "divider"
			}}
		>
			<Stack spacing={2}>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={1}
					sx={{
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" }
					}}
				>
					<Typography variant="h6">{ladder.name}</Typography>
					<Chip label={status} color="primary" />
				</Stack>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, minmax(0, 1fr))",
							lg: "repeat(3, minmax(0, 1fr))"
						},
						gap: 1.5
					}}
				>
					<DataDisplay description="Status" value={status} />
					<DataDisplay description="Type" value={ladder.ladderType} />
					{ladder.divisions ? (
						<DataDisplay
							description="Divisions"
							value={"" + ladder.divisions.length}
						/>
					) : (
						""
					)}
					<DataDisplay
						description="Teams"
						value={(ladder.calculateTeams() || "None Yet") + ""}
					/>
					<DataDisplay
						description="Total Rounds"
						value={"" + ladder.numRounds}
					/>
					<DataDisplay
						description="Rounds Played"
						value={
							(ladder.calculateRoundsPlayed() || "None that I can tell") + ""
						}
					/>
				</Box>
			</Stack>
		</Paper>
	);
};

export default LadderInfoSection;
