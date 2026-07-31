import React from "react";
import { Box, Paper } from "@mui/material";
import Teams from "../components/ScoreSheet/Teams";
import { RoundContextProvider } from "../contexts/RoundContext";
import TotalScores from "../components/ScoreSheet/TotalScores";
import Questions from "../components/ScoreSheet/Questions";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import ScoreSheetHeader from "../components/ScoreSheet/ScoreSheetHeader";
// @ts-ignore
import "./ScoreSheet.css";

export interface Player {
	name: string;
	isCaptain?: boolean;
}

const ScoreSheet = () => {
	const [query] = useSearchParams();
	const ladderId = query.get("ladder");
	const publicId = query.get("publicId");
	const theme = useTheme();

	return (
		<Box
			component="section"
			sx={{
				display: "grid",
				gap: 2,
				backgroundColor: "background.paper",
				"& *": {
					backgroundColor: "background.paper"
				}
			}}
			className="score-sheet"
		>
			<Paper
				elevation={0}
				sx={{
					[theme.breakpoints.down("md")]: {
						p: 2,
						bgcolor: "background.paper"
					},
					[theme.breakpoints.up("md")]: {
						p: 3,
						bgcolor: "background.paper"
					}
				}}
			>
				<RoundContextProvider>
					<ScoreSheetHeader ladderId={ladderId} publicId={publicId} />
					<Teams />
					<TotalScores />
					<Questions />
				</RoundContextProvider>
			</Paper>
		</Box>
	);
};

export default ScoreSheet;
