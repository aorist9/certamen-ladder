import React from "react";
import "./ScoreSheet.css";
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
		<section className="App-page score-sheet">
			<RoundContextProvider>
				<ScoreSheetHeader ladderId={ladderId} publicId={publicId} />
				<Teams />
				<TotalScores />
				<Questions />
			</RoundContextProvider>
		</section>
	);
};

export default ScoreSheet;
