import React, { useMemo } from "react";
import LadderType from "../types/LadderType";

type ScoreRow = {
	team: string;
	roundScores: (number | undefined)[];
	total: number;
};

type ScoreboardProps = {
	ladder: LadderType;
	name?: string;
};

const Scoreboard = (props: ScoreboardProps) => {
	const { ladder, name } = props;

	const scores: ScoreRow[] = useMemo(() => {
		// @ts-ignore
		const result: ScoreRow[] = Object.values(ladder.teams).map(team => ({
			team,
			roundScores: [],
			total: 0
		}));
		if (ladder.matches) {
			ladder.matches.forEach((round, roundNum) => {
				round.forEach(match => {
					match.forEach(t => {
						const boardTeam = result.find(team => t.team === team.team);
						boardTeam?.roundScores.push(t.score);
						if (boardTeam && t.score) {
							boardTeam.total += t.score;
						}
					});
				});
			});
		}
		return result;
	}, [ladder]);

	const sortedScores: ScoreRow[] = scores?.sort(
		(score1, score2) => score2.total - score1.total
	);

	return (
		<section>
			{ladder && sortedScores ? (
				<>
					{name ? <h3>{name}</h3> : ""}
					<table>
						<thead>
							<tr>
								<th>Team</th>
								{ladder.matches?.map((_, idx) => (
									<th key={idx}>Round {idx + 1}</th>
								))}
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{sortedScores.map(team => (
								<tr key={team.team}>
									<td data-testid="team-cell">{team.team}</td>
									{team.roundScores.map((round, rdNum) => (
										<td
											key={rdNum}
											data-testid={`round-${rdNum + 1}-score-cell`}
										>
											{round}
										</td>
									))}
									<td data-testid="total-score-cell">{team.total}</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			) : (
				"You may have reached this page in error"
			)}
		</section>
	);
};

export default Scoreboard;
