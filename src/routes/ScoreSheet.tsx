import React from "react";
import "./ScoreSheet.css";
import Teams from "../components/ScoreSheet/Teams";
import { RoundContextProvider } from "../contexts/RoundContext";
import TotalScores from "../components/ScoreSheet/TotalScores";
import Questions from "../components/ScoreSheet/Questions";
import { Link, useSearchParams } from "react-router-dom";

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
				<header className="score-sheet-header">
					<h2>Code Sheet</h2>
					<Link
						className="do-not-print"
						to={`/ladder?${
							ladderId ? `ladder=${ladderId}` : `publicId=${publicId}`
						}`}
					>
						Return to Ladder
					</Link>
				</header>
				<Teams />
				<TotalScores />
				<Questions />
			</RoundContextProvider>
		</section>
	);
};

export default ScoreSheet;
