import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import Scoreboard from "../components/Scoreboard";
import { useLadder } from "../services/ladderService";

const ScoreboardPage = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const publicId: string | null = useSearchParams()[0].get("publicId");
	const { ladder } = useLadder({ ladderId, publicLadderId: publicId });

	const header = (
		<Paper
			elevation={0}
			sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}
		>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				sx={{
					spacing: 2,
					justifyContent: "space-between",
					alignItems: "flex-start"
				}}
			>
				<Typography variant="h4">{ladder?.name}</Typography>
				<Button
					component={RouterLink}
					to={`/ladder${ladderId ? `?ladder=${ladderId}` : `?publicId=${publicId}`}`}
					variant="outlined"
				>
					Ladder
				</Button>
			</Stack>
		</Paper>
	);

	if (
		ladder?.divisions?.length &&
		ladder.divisions?.some(d => d.matches?.length)
	) {
		return (
			<Box component="section" sx={{ display: "grid", gap: 2 }}>
				{header}
				<Grid container spacing={2} sx={{ flexWrap: "wrap" }}>
					{ladder.divisions.map((d, idx) => (
						<Grid key={d.division} size={{ xs: 12, lg: 6 }}>
							<Scoreboard
								name={d.division}
								ladder={ladder}
								divisionNumber={idx}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		);
	} else {
		return (
			<Box component="section" sx={{ p: 3 }}>
				<Typography>You may have reached this page in error</Typography>
			</Box>
		);
	}
};

export default ScoreboardPage;
