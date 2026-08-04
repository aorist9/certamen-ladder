import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRoundContext } from "../../contexts/RoundContext";
import { LETTERS } from "../../types/Round";
import { NOT_A_TEAM } from "../../constants";

const TotalScores = () => {
	const { scores, teams } = useRoundContext();
	return (
		<Stack
			direction="row"
			sx={{
				justifyContent: "space-around"
			}}
			className="total-scores"
		>
			{scores.map((score, idx) =>
				teams[idx].name === NOT_A_TEAM.name ? (
					""
				) : (
					<Stack
						direction="column"
						sx={{ gap: "1em" }}
						className="team-total-score"
						key={idx}
					>
						<Typography variant="h6" className="letter">
							{LETTERS[idx]}
						</Typography>
						<Typography variant="h6" className="score">
							{score}
						</Typography>
					</Stack>
				)
			)}
		</Stack>
	);
};

export default TotalScores;
