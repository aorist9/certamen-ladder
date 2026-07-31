import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import calculateScores, {
	ScoreRow,
	sortScores
} from "../utils/calculateScores";
import { Ladder } from "../types/LadderType";

type ScoreboardProps = {
	ladder: Ladder;
	name?: string;
	divisionNumber: number;
};

const Scoreboard = (props: ScoreboardProps) => {
	const { divisionNumber, ladder, name } = props;

	const scores: ScoreRow[] = useMemo(
		() => calculateScores(ladder, divisionNumber),
		[ladder, divisionNumber]
	);

	const sortedScores: ScoreRow[] = scores?.sort(sortScores);

	return (
		<Box>
			{ladder && sortedScores ? (
				<Paper
					variant="outlined"
					sx={{ p: 2, bgcolor: "background.paper", borderColor: "divider" }}
				>
					{name ? (
						<Typography variant="h6" sx={{ mb: 1.5 }}>
							{name}
						</Typography>
					) : (
						""
					)}
					<TableContainer>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Team</TableCell>
									{ladder.divisions?.[divisionNumber].matches?.map((_, idx) => (
										<TableCell key={idx}>Round {idx + 1}</TableCell>
									))}
									{ladder.isSwiss() ? (
										<TableCell>Total Swiss Points</TableCell>
									) : (
										""
									)}
									{ladder.isSwiss() ? <TableCell>SOS</TableCell> : ""}
									<TableCell>Total Score</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sortedScores.map(team => (
									<TableRow key={team.team}>
										<TableCell data-testid="team-cell">{team.team}</TableCell>
										{team.roundScores.map((round, rdNum) => (
											<TableCell
												key={rdNum}
												data-testid={`round-${rdNum + 1}-score-cell`}
											>
												{round}
												{team.roundSwiss && team.roundSwiss.length > rdNum
													? ` / ${team.roundSwiss[rdNum]}`
													: ""}
											</TableCell>
										))}
										{team.swissTotal ? (
											<TableCell data-testid="total-swiss-cell">
												{team.swissTotal}
											</TableCell>
										) : (
											""
										)}
										{team.sos ? (
											<TableCell data-testid="sos-cell">{team.sos}</TableCell>
										) : (
											""
										)}
										<TableCell data-testid="total-score-cell">
											{team.total}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			) : (
				<Typography color="text.secondary">
					You may have reached this page in error
				</Typography>
			)}
		</Box>
	);
};

export default Scoreboard;
