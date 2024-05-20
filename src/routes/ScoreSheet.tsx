import React from "react";
import "./ScoreSheet.css";
import Teams from "../components/ScoreSheet/Teams";
import { RoundContextProvider } from "../contexts/RoundContext";
import TotalScores from "../components/ScoreSheet/TotalScores";
import Questions from "../components/ScoreSheet/Questions";

export interface Player {
	name: string;
	isCaptain?: boolean;
}

const ScoreSheet = () => {
	return (
		<section className="App-page score-sheet">
			<RoundContextProvider>
				<h2>Code Sheet</h2>
				<Teams />
				<TotalScores />
				<Questions />
			</RoundContextProvider>
		</section>
	);
};

export default ScoreSheet;
