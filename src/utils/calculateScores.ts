import { Ladder } from "../types/LadderType";

export type ScoreRow = {
	team: string;
	roundScores: (number | undefined)[];
	roundSwiss?: (number | undefined)[];
	total: number;
	swissTotal?: number;
	sos?: number;
};

export const sortScores = (score1: ScoreRow, score2: ScoreRow) => {
	if (score1.swissTotal && score2.swissTotal) {
		if (score1.swissTotal !== score2.swissTotal) {
			return score2.swissTotal - score1.swissTotal;
		} else if (
			score1.sos !== undefined &&
			score2.sos !== undefined &&
			score1.sos !== score2.sos
		) {
			return score2.sos - score1.sos;
		}
	}

	return score2.total - score1.total;
};

const calculateScores = (
	ladder: Ladder,
	divisionNumber: number
): ScoreRow[] => {
	const division = ladder.divisions?.[divisionNumber];
	if (!division) {
		return [];
	}

	let result: ScoreRow[] = Object.values(division.teams).map(team =>
		ladder.isSwiss()
			? {
					team,
					roundScores: [],
					roundSwiss: [],
					total: 0,
					swissTotal: 0
			  }
			: {
					team,
					roundScores: [],
					total: 0
			  }
	);

	if (division.matches) {
		division.matches.forEach(round => {
			round.forEach(match => {
				match.teams.forEach(t => {
					const boardTeam = result.find(team => t.team === team.team);
					if (boardTeam) {
						boardTeam.roundScores.push(t.score);
						if (t.swissPoints) {
							boardTeam?.roundSwiss?.push(t.swissPoints);
						}

						if (t.score) {
							boardTeam.total += t.score;
						}
						if (boardTeam.swissTotal !== undefined && t.swissPoints) {
							boardTeam.swissTotal += t.swissPoints;
						}
					}
				});
			});
		});
	}

	if (ladder.isSwiss() && division.matches) {
		result = result.map(row => ({
			...row,
			// @ts-ignore
			sos: division.matches.reduce((acc, round) => {
				const match = round.find(
					room => !!room.teams.find(t => t.team === row.team)
				);
				if (match && match.teams[0].score !== undefined) {
					return match.teams
						.filter(team => team.team !== row.team)
						.reduce((sos, team) => {
							const foundTeam = result.find(r => r.team === team.team);
							return sos + (foundTeam?.swissTotal || 0);
						}, acc);
				} else {
					return acc;
				}
			}, 0)
		}));
	}

	return result;
};

export default calculateScores;
