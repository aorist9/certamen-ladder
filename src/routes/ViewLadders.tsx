import React, { useState } from "react";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import { Link } from "react-router-dom";

const ViewLadders = () => {
	const [ladders, setLadders] = useState<LadderType[]>(
		ladderService.getLadders()
	);
	let maxWidth = ladders.reduce((acc: number, ladder: LadderType): number => {
		if (ladder.name.length > acc) {
			return ladder.name.length;
		} else {
			return acc;
		}
	}, 0);

	return (
		<section className="App-page view-ladders">
			<h2>Existing Ladders</h2>
			<ul>
				{ladders.map((ladder: LadderType) => (
					<li
						key={ladder.id}
						style={{
							display: "flex",
							justifyContent: "space-between",
							maxWidth: `${maxWidth}.5em`,
							marginBottom: "0.5em"
						}}
					>
						<Link
							to={`/${ladder.teams ? "ladder" : "draw"}?ladder=${ladder.id}`}
						>
							{ladder.name}
						</Link>
						<button
							onClick={() => {
								ladderService.deleteLadder(ladder.id);
								setLadders(
									ladders.filter((l: LadderType) => l.id !== ladder.id)
								);
							}}
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</section>
	);
};

export default ViewLadders;
