import React, { useMemo } from "react";
import calculateScores, {
	ScoreRow,
	sortScores
} from "../utils/calculateScores";
import LadderType from "../types/LadderType";

type ScoreboardProps = {
	ladder: LadderType;
	name?: string;
};

const Scoreboard = (props: ScoreboardProps) => {
	const { ladder, name } = props;

	const scores: ScoreRow[] = useMemo(() => calculateScores(ladder), [ladder]);

	const sortedScores: ScoreRow[] = scores?.sort(sortScores);

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
								{ladder.type === 1 || ladder.type === 2 ? <th>Total Swiss Points</th> : ""}
								{ladder.type === 1 || ladder.type === 2 ? <th>SOS</th> : ""}
								<th>Total Score</th>
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
											{team.roundSwiss && team.roundSwiss.length > rdNum
												? ` / ${team.roundSwiss[rdNum]}`
												: ""}
										</td>
									))}
									{team.swissTotal ? (
										<td data-testid="total-swiss-cell">{team.swissTotal}</td>
									) : (
										""
									)}
									{team.sos ? <td data-testid="sos-cell">{team.sos}</td> : ""}
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
