import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import pittingService from "../services/pittingService";
import "./LadderDisplay.css";

const LadderDisplay = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const ladder: LadderType | undefined = useMemo(() => {
		if (ladderId) {
			return ladderService.getLadder(ladderId);
		}
	}, [ladderId]);
	const pittings: string[][][] = useMemo(
		() => pittingService.generateInitialPittings(ladder),
		[ladder]
	);

	if (ladder && pittings && pittings.length) {
		return (
			<section className="App-page ladder-display">
				<h2>{ladder.name}</h2>
				<table>
					<thead>
						<tr>
							{pittings.map((_, i: number) => (
								<th key={i}>Round {i + 1}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{pittings[0].map((_, i: number) => (
							<tr key={i}>
								{pittings.map((_, j: number) => (
									<td key={`${j}:${i}`} data-testid={`round-${j + 1}`}>
										<ul>
											{pittings[j][i].map((team: string) => (
												<li key={team}>{team}</li>
											))}
										</ul>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
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
