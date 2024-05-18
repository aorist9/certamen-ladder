import React from "react";
import "./ScoreSheet.css";
import Teams from "../components/ScoreSheet/Teams";
import { RoundContextProvider } from "../contexts/RoundContext";
import TotalScores from "../components/ScoreSheet/TotalScores";
import Questions from "../components/ScoreSheet/Questions";

const inputTeams = [
	"West Ridge Middle School",
	"St. Andrew's Middle School",
	"Clint Small Middle School"
];

export interface Player {
	name: string;
	isCaptain?: boolean;
}

const ScoreSheet = () => {
	return (
		<RoundContextProvider teams={inputTeams}>
			<section className="App-page score-sheet">
				<h2>Code Sheet</h2>
				<Teams />
				<TotalScores />
				<Questions />
			</section>
		</RoundContextProvider>
	);
};

export default ScoreSheet;
