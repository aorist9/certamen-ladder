import React from "react";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import { useFeatureFlags } from "../contexts/featureFlagsContext";

const Home = () => {
	const {
		publishLadder: publishLadderFlag,
		swissLadder: swissLadderFlag,
		pointsSwissLadder: pointsSwissLadderFlag,
		codeSheet: codeSheetFlag
	} = useFeatureFlags();

	return (
		<Box component="section" sx={{ display: "grid", gap: 3 }}>
			<Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}>
				<Typography variant="h4" gutterBottom>
					Welcome to Certamen Ladder
				</Typography>
				<Typography color="text.secondary">
					Check the sidebar to create ladders or view ladders that you previously created.
				</Typography>
			</Paper>

			<Stack spacing={2}>
				<Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}>
					<Typography variant="h6" gutterBottom>
						About this Tool
					</Typography>
					<Typography color="text.secondary">
						Certamen Ladder allows you to create ladders for Certamen tournaments, including
						help doing the draw, setting the pittings, and keeping score.
					</Typography>
				</Paper>

				{publishLadderFlag ? (
					<Alert severity="info" sx={{ border: 1, borderColor: "divider", bgcolor: "background.default" }}>
						Ladders can now be made public to share via a link; watch the sidebar for the
						opportunity to publish your ladder. Even when a ladder is shared it can only be
						updated or edited from the computer that created it.
					</Alert>
				) : (
					<Alert severity="info" sx={{ border: 1, borderColor: "divider", bgcolor: "background.default" }}>
						Although Certamen Ladder is on the web and runs in your browser, the data you put
						in stays on your computer. Ladders are designed to be printed out for sharing
						purposes, but there is currently no built-in way to share your ladder from this app.
					</Alert>
				)}

				{codeSheetFlag && (
					<Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}>
						<Typography variant="h6" gutterBottom>
							Score Sheets
						</Typography>
						<Typography color="text.secondary">
							You can keep score in the app and share a link with another device so the score
							updates automatically on the ladder and scoreboard pages.
						</Typography>
					</Paper>
				)}

				{swissLadderFlag ? (
					<Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}>
						<Typography variant="h6" gutterBottom>
							About the Swiss System
						</Typography>
						<Typography color="text.secondary">
							When creating a ladder you can choose Swiss seeding, which will provide the
							pittings for the first round and then determine later rounds by pairing teams
							based on their performance.
						</Typography>
						{pointsSwissLadderFlag && (
							<Typography color="text.secondary" sx={{ mt: 1 }}>
								Swiss by Points is also available as an experimental option where points are
								awarded by placement within the score range rather than by winning a round.
							</Typography>
						)}
					</Paper>
				) : null}
			</Stack>
		</Box>
	);
};

export default Home;
