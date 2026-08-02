import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import ladderService from "../services/ladderService";
import { Ladder, LadderStatus } from "../types/LadderType";
import LadderInfoSection from "../components/LadderInfoSection";

const ViewLadders = () => {
	const [ladders, setLadders] = useState<Ladder[]>(ladderService.getLadders());

	return (
		<Box component="section" sx={{ display: "grid", gap: 2 }}>
			<Paper
				elevation={0}
				sx={{ p: { xs: 3, md: 4 }, bgcolor: "background.paper" }}
			>
				<Typography variant="h4" gutterBottom>
					Existing Ladders
				</Typography>
				<Typography color="text.secondary">
					Click one to see the ladder
				</Typography>
			</Paper>
			<Grid container spacing={2}>
				{ladders.map((l: Ladder) => {
					const ladder: Ladder = new Ladder(l);
					return (
						<Grid size={{ xs: 12, sm: 6, md: 4 }} key={ladder.id}>
							<Paper
								elevation={0}
								sx={{
									p: 2,
									display: "flex",
									gap: 2,
									justifyContent: "space-between",
									alignItems: "center",
									flexWrap: "wrap",
									flexDirection: { xs: "row", sm: "column" }
								}}
							>
								<Box
									component={RouterLink}
									to={`/${ladder.calculateStatus() === LadderStatus.CREATED ? "draw" : "ladder"}?ladder=${ladder.id}`}
									sx={{ textDecoration: "none", color: "inherit", flex: 1 }}
								>
									<LadderInfoSection ladder={ladder} />
								</Box>
								<Button
									variant="contained"
									color="error"
									onClick={() => {
										ladderService.deleteLadder(ladder.id);
										setLadders(
											ladders.filter((l: Ladder) => l.id !== ladder.id)
										);
									}}
									sx={{ width: { xs: "100%", sm: "50%", lg: "33%" } }}
								>
									Delete
								</Button>
							</Paper>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
};

export default ViewLadders;
