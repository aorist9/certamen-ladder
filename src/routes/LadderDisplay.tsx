import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import pittingService from "../services/pittingService";
import "./LadderDisplay.css";
import DisplayedLadder from "../components/DisplayedLadder";

const LadderDisplay = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const ladder: LadderType | undefined = useMemo(() => {
		if (ladderId) {
			return ladderService.getLadder(ladderId);
		}
	}, [ladderId]);

	if (ladder) {
		return (
			<section className="App-page ladder-display">
				<h2>{ladder.name}</h2>
				{Array.isArray(ladder.teams) ? (
					ladder.teams.map(team => (
						<DisplayedLadder
							key={team.division}
							name={team.division}
							ladder={{ ...ladder, teams: team.teams }}
						/>
					))
				) : (
					<DisplayedLadder ladder={ladder} />
				)}
			</section>
		);
	} else {
		return (
			<section className="App-page ladder-display">
				You may have reached this page in error
			</section>
		);
	}
};

export default LadderDisplay;
