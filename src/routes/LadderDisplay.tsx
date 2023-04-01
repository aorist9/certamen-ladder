import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import DisplayedLadder from "../components/DisplayedLadder";
import "./LadderDisplay.css";

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
					<section className="multi-ladder-display">
						{ladder.teams.map((team, idx) => (
							<DisplayedLadder
								key={team.division}
								name={team.division}
								ladder={{ ...ladder, rooms: team.rooms, teams: team.teams }}
								updateRooms={(rooms: string[]) => {
									// @ts-ignore
									const newTeams = [...ladder.teams];
									newTeams[idx].rooms = rooms;
									const newLadder: LadderType = {
										...ladder,
										teams: newTeams
									};
									ladderService.editLadder(newLadder);
								}}
							/>
						))}
					</section>
				) : (
					<DisplayedLadder
						ladder={ladder}
						updateRooms={(rooms: string[]) => {
							ladderService.editLadder({ ...ladder, rooms });
						}}
					/>
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
