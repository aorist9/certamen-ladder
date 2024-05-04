import React, { useState } from "react";
import "./ScoreSheet.css";
import Teams from "../components/ScoreSheet/Teams";

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
	const [teams, setTeams] = useState(inputTeams);
	const [players, setPlayers] = useState<Record<string, Player[]>>(
		teams.reduce((acc, team) => {
			acc[team] = [{ name: "" }, { name: "" }, { name: "" }, { name: "" }];
			return acc;
		}, {} as Record<string, Player[]>)
	);
	return (
		<section className="App-page score-sheet">
			<h2>Code Sheet</h2>
			<Teams
				players={players}
				teams={teams}
				setPlayers={setPlayers}
				setTeams={setTeams}
			/>
		</section>
	);
};

export default ScoreSheet;
