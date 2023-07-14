import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import Matches from "../types/Matches";
import DisplayedLadder from "../components/DisplayLadder/DisplayedLadder";
import "./LadderDisplay.css";

export const retrievePublicOrPrivateLadder = (
	ladderId: string | null,
	setLadder: React.Dispatch<React.SetStateAction<LadderType | undefined>>,
	publicId: string | null
) => {
	if (ladderId) {
		setLadder(ladderService.getLadder(ladderId));
	} else if (publicId) {
		ladderService.getPublicLadder(publicId).then(setLadder);
	}
};

const LadderDisplay = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const publicId: string | null = useSearchParams()[0].get("publicId");
	const [ladder, setLadder] = useState<LadderType | undefined>();

	useEffect(
		() => retrievePublicOrPrivateLadder(ladderId, setLadder, publicId),
		[ladderId, publicId]
	);

	const hideIfPublic = (
		elem: string | JSX.Element | JSX.Element[]
	): string | JSX.Element | JSX.Element[] => (ladderId ? elem : "");

	if (ladder) {
		return (
			<section className="App-page ladder-display">
				<section style={{ display: "flex", columnGap: "2em" }}>
					<h2>{ladder.name}</h2>
					<Link
						to={`/scoreboard?${
							ladderId ? `ladder=${ladderId}` : `publicId=${publicId}`
						}`}
						style={{ margin: "auto 0" }}
						className="hide-print"
					>
						Scoreboard
					</Link>
				</section>
				{hideIfPublic(
					<p className="hide-print">
						Click and drag to move a match up and down to a different room
					</p>
				)}
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
								hideIfPublic={hideIfPublic}
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
						hideIfPublic={hideIfPublic}
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
