import React, { useMemo } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import ladderService, { useLadder } from "../services/ladderService";
import { MatchesV2 } from "../types/Matches";
import DisplayedLadder from "../components/DisplayLadder/DisplayedLadder";

const LadderDisplay = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const publicId: string | null = useSearchParams()[0].get("publicId");
	const { ladder, updateLadder } = useLadder({
		ladderId,
		publicLadderId: publicId
	});

	const hideIfPublic = (
		elem: string | JSX.Element | JSX.Element[]
	): string | JSX.Element | JSX.Element[] => (ladderId ? elem : "");

	const canStillGoBack = useMemo(() => {
		return !ladder?.divisions?.some(div => div.matches);
	}, [ladder]);

	if (ladder) {
		const message = ladder.displayedMessage();
		return (
			<Box component="section" sx={{ display: "grid", gap: 2 }}>
				<Paper
					elevation={0}
					sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}
				>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
					>
						<Typography variant="h2">{ladder.name}</Typography>
						<Button
							className="hide-print"
							component={RouterLink}
							to={`/scoreboard${ladderId ? `?ladder=${ladderId}` : `?publicId=${publicId}`}`}
							variant="outlined"
						>
							Scoreboard
						</Button>
					</Stack>
					{message ? (
						<Alert
							severity="info"
							sx={{
								mt: 2,
								border: 1,
								borderColor: "divider",
								bgcolor: "background.default"
							}}
						>
							{message}
						</Alert>
					) : null}
					{hideIfPublic(
						<Typography
							color="text.secondary"
							sx={{ mt: 2 }}
							className="hide-print"
						>
							Click and drag to move a match up and down to a different room.
						</Typography>
					)}
					{canStillGoBack &&
						hideIfPublic(
							<Button
								component={RouterLink}
								to={`/draw?ladder=${ladderId}`}
								variant="text"
								sx={{ mt: 1 }}
							>
								Add/Remove Teams
							</Button>
						)}
				</Paper>
				<Stack className="multi-ladder-display" direction="column" spacing={4}>
					{ladder?.divisions?.map((division, idx) => (
						<DisplayedLadder
							divisionNumber={idx}
							key={division.division}
							name={division.division}
							ladder={ladder}
							updateMatches={(matches: MatchesV2) => {
								if (ladder?.divisions) {
									ladder.divisions[idx].matches = matches;
									ladderService.editLadder(ladder);
								}
							}}
							updateRooms={(rooms: string[]) => {
								if (ladder?.divisions) {
									ladder.divisions[idx].rooms = rooms;
									ladderService.editLadder(ladder);
								}
							}}
							updateLadder={updateLadder}
							hideIfPublic={hideIfPublic}
						/>
					))}
				</Stack>
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

export default LadderDisplay;
