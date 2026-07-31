import React from "react";
import { Box, Paper } from "@mui/material";
import Teams from "../components/ScoreSheet/Teams";
import { RoundContextProvider } from "../contexts/RoundContext";
import TotalScores from "../components/ScoreSheet/TotalScores";
import Questions from "../components/ScoreSheet/Questions";
import { useSearchParams } from "react-router-dom";
import ScoreSheetHeader from "../components/ScoreSheet/ScoreSheetHeader";

export interface Player {
	name: string;
	isCaptain?: boolean;
}

const ScoreSheet = () => {
	const [query] = useSearchParams();
	const ladderId = query.get("ladder");
	const publicId = query.get("publicId");

	return (
		<Box component="section" sx={{ display: "grid", gap: 2 }}>
			<Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: "background.paper" }}>
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
