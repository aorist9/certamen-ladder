import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ladderService, { useLadder } from "../services/ladderService";
import { MatchesV2 } from "../types/Matches";
import DisplayedLadder from "../components/DisplayLadder/DisplayedLadder";
import "./LadderDisplay.css";

const LadderDisplay = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const publicId: string | null = useSearchParams()[0].get("publicId");
	const ladder = useLadder({ ladderId, publicLadderId: publicId });

	const hideIfPublic = (
		elem: string | JSX.Element | JSX.Element[]
	): string | JSX.Element | JSX.Element[] => (ladderId ? elem : "");

	const canStillGoBack = useMemo(() => {
		if (!ladder) {
			return true;
		}

		return ladder?.divisions?.some(div => div.matches) ?? true;
	}, [ladder]);

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
				{canStillGoBack &&
					hideIfPublic(
						<Link to={`/draw?ladder=${ladderId}`} className="hide-print">
							Add/Remove Teams
						</Link>
					)}
				<section className="multi-ladder-display">
					{ladder?.divisions?.map((division, idx) => (
						<DisplayedLadder
							divisionNumber={idx}
							key={division.division}
							name={division.division}
							ladder={ladder}
							updateMatches={(matches: MatchesV2) => {
								if (ladder?.divisions) {
									ladder.divisions[idx].matches = matches;
									ladderService.editLadder(ladder);
								}
							}}
							updateRooms={(rooms: string[]) => {
								if (ladder?.divisions) {
									ladder.divisions[idx].rooms = rooms;
									ladderService.editLadder(ladder);
								}
							}}
							hideIfPublic={hideIfPublic}
						/>
					))}
				</section>
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
