import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import Matches from "../types/Matches";
import DisplayedLadder from "../components/DisplayLadder/DisplayedLadder";
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
				<section style={{ display: "flex", columnGap: "2em" }}>
					<h2>{ladder.name}</h2>
					<Link
						to={`/scoreboard?ladder=${ladderId}`}
						style={{ margin: "auto 0" }}
						className="hide-print"
					>
						Scoreboard
					</Link>
				</section>
				<p className="hide-print">
					Click and drag to move a match up and down to a different room
				</p>
				{Array.isArray(ladder.teams) ? (
					<section className="multi-ladder-display">
						{ladder.teams.map((team, idx) => (
							<DisplayedLadder
								key={team.division}
								name={team.division}
								ladder={{
									...ladder,
									rooms: team.rooms,
									teams: team.teams,
									matches: team.matches
								}}
								updateMatches={(matches: Matches) => {
									// @ts-ignore
									const newTeams = [...ladder.teams];
									newTeams[idx].matches = matches;
									const newLadder: LadderType = {
										...ladder,
										teams: newTeams
									};
									ladderService.editLadder(newLadder);
								}}
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
						updateMatches={(matches: Matches) => {
							ladderService.editLadder({ ...ladder, matches });
						}}
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
