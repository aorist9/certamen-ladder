import React, { useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ladderService from "../services/ladderService";
import { Ladder, LadderStatus } from "../types/LadderType";
import LadderInfoSection from "../components/LadderInfoSection";

const ViewLadders = () => {
	const [ladders, setLadders] = useState<Ladder[]>(ladderService.getLadders());

	return (
		<Box component="section" sx={{ display: "grid", gap: 2 }}>
			<Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}>
				<Typography variant="h4" gutterBottom>
					Existing Ladders
				</Typography>
				<Typography color="text.secondary">Click one to see the ladder</Typography>
			</Paper>
			<Stack spacing={2}>
				{ladders.map((l: Ladder) => {
					const ladder: Ladder = new Ladder(l);
					return (
						<Paper key={ladder.id} elevation={0} sx={{ p: 2, display: "flex", gap: 2, justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
							<Box component={RouterLink} to={`/${ladder.calculateStatus() === LadderStatus.CREATED ? "draw" : "ladder"}?ladder=${ladder.id}`} sx={{ textDecoration: "none", color: "inherit", flex: 1 }}>
								<LadderInfoSection ladder={ladder} />
							</Box>
							<Button
								variant="outlined"
								color="error"
								onClick={() => {
									ladderService.deleteLadder(ladder.id);
									setLadders(ladders.filter((l: Ladder) => l.id !== ladder.id));
								}}
							>
								Delete
							</Button>
						</Paper>
					);
				})}
			</Stack>
		</Box>
	);
};

export default ViewLadders;
