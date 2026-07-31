import React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import Scoreboard from "../components/Scoreboard";
import { useLadder } from "../services/ladderService";

const ScoreboardPage = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const publicId: string | null = useSearchParams()[0].get("publicId");
	const { ladder } = useLadder({ ladderId, publicLadderId: publicId });

	const header = (
		<Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}>
			<Stack direction={{ xs: "column", sm: "row" }} sx={{ spacing: 2, justifyContent: "space-between", alignItems: "flex-start" }}>
				<Typography variant="h4">{ladder?.name}</Typography>
				<Button component={RouterLink} to={`/ladder${ladderId ? `?ladder=${ladderId}` : `?publicId=${publicId}`}`} variant="outlined">
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
				<Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
					{ladder.divisions.map((d, idx) => (
						<Scoreboard
							key={d.division}
							name={d.division}
							ladder={ladder}
							divisionNumber={idx}
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

export default ScoreboardPage;
