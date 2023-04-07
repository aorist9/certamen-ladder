import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import Scoreboard from "../components/Scoreboard";
import "./ScoreboardPage.css";

const ScoreboardPage = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const ladder: LadderType | undefined = ladderId
		? ladderService.getLadder(ladderId)
		: undefined;

	const header = (
		<section style={{ display: "flex", columnGap: "2em" }}>
			<h2>{ladder?.name}</h2>
			<Link to={`/ladder?ladder=${ladderId}`} style={{ margin: "auto 0" }}>
				Ladder
			</Link>
		</section>
	);

	if (ladder?.matches) {
		return (
			<section className="App-page scoreboard">
				{header}
				<Scoreboard ladder={ladder} />
			</section>
		);
		// @ts-ignore
	} else if (ladder?.teams?.length && ladder.teams[0].matches?.length) {
		return (
			<section className="App-page scoreboard">
				{header}
				<section
					style={{ display: "flex", flexWrap: "wrap", columnGap: "1em" }}
				>
					{
						// @ts-ignore
						ladder.teams.map(d => (
							<Scoreboard
								key={d.division}
								name={d.division}
								ladder={{ ...ladder, matches: d.matches, teams: d.teams }}
							/>
						))
					}
				</section>
			</section>
		);
	} else {
		return (
			<section className="App-page scoreboard">
				"You may have reached this page in error"
			</section>
		);
	}
};

export default ScoreboardPage;
