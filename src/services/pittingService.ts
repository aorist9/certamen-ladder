import LadderType from "../types/LadderType";
import Matches from "../types/Matches";
import calculateScores, {
	ScoreRow,
	sortScores
} from "../utils/calculateScores";
import { handleSpecialCase, isSpecialCase } from "./specialCases";

type Conflict = { total: number; roundConflicts: number[] };
export type TeamEntry = { team: string; rank: number };

const NOT_A_TEAM = "NOT-A-TEAM";

const pushIfTeam = (team: string, array: string[]) => {
	if (team !== NOT_A_TEAM) {
		array.push(team);
	}
};

const calculateSinglePittingConflict = (
	matches: Matches,
	pitting: string[]
): number => {
	const conflictCount = matches.reduce(
		(acc, round) =>
			acc +
			round.reduce((roundAcc, matchup) => {
				let rawConflict: number = matchup.reduce(
					(pittingAcc, team) =>
						pitting.includes(team.team) ? pittingAcc + 1 : pittingAcc,
					0
				);
				if (rawConflict === 0) {
					return roundAcc;
				} else {
					return roundAcc + rawConflict - 1;
				}
			}, 0),
		0
	);
	return conflictCount;
};

const calculateConflict = (
	proposedRound: TeamEntry[][],
	matches: Matches
): Conflict => {
	const result: Conflict = {
		total: 0,
		roundConflicts: []
	};
	proposedRound.forEach(pitting => {
		let conflictCount: number = calculateSinglePittingConflict(
			matches,
			pitting.map(t => t.team)
		);
		result.total += conflictCount;
		result.roundConflicts.push(conflictCount);
	});
	return result;
};

const deconflictRound = (
	round: TeamEntry[][],
	matches: Matches
): string[][] => {
	const currentConflict: Conflict = calculateConflict(round, matches);
	const totalTeams = matches[0].reduce((acc, room) => acc + room.length, 0);

	if (currentConflict.total > 0) {
		for (
			let roomIdx = currentConflict.roundConflicts.length - 1;
			roomIdx >= 0;
			roomIdx--
		) {
			if (currentConflict.roundConflicts[roomIdx] === 0) {
				continue;
			}

			// determine longest possible swap distance from this room
			let longestSwapDistance = 0;
			round[roomIdx].forEach(t => {
				if (t.rank - 1 > longestSwapDistance) {
					longestSwapDistance = t.rank - 1;
				}

				if (totalTeams - t.rank > longestSwapDistance) {
					longestSwapDistance = totalTeams - t.rank;
				}
			});

			// iterate from lowest to highest swap distance
			for (
				let swapDistance = 1;
				swapDistance <= longestSwapDistance;
				swapDistance++
			) {
				let teamsSortedByDescendingRank = round[roomIdx].sort(
					(t1, t2) => t2.rank - t1.rank
				);

				// try all downward swaps of distance `swapDistance`
				for (
					let teamIdx = 0;
					teamIdx < teamsSortedByDescendingRank.length;
					teamIdx++
				) {
					let rankToSwap =
						teamsSortedByDescendingRank[teamIdx].rank + swapDistance;
					const successfulSwap: TeamEntry[][] | undefined = swapByRank({
						currentConflict,
						matches,
						rankToSwap,
						roomIdx,
						round,
						teamIdx,
						teamsSortedByDescendingRank
					});
					if (successfulSwap) {
						return deconflictRound(successfulSwap, matches);
					}
				}

				// try all upward swaps of distance `swapDistance`
				for (
					let teamIdx = 0;
					teamIdx < teamsSortedByDescendingRank.length;
					teamIdx++
				) {
					let rankToSwap =
						teamsSortedByDescendingRank[teamIdx].rank - swapDistance;
					const successfulSwap: TeamEntry[][] | undefined = swapByRank({
						currentConflict,
						matches,
						rankToSwap,
						roomIdx,
						round,
						teamIdx,
						teamsSortedByDescendingRank
					});
					if (successfulSwap) {
						return deconflictRound(successfulSwap, matches);
					}
				}
			}
		}
	}
	return round.map(room => room.map(team => team.team));
};

const swapByRank = ({
	currentConflict,
	matches,
	rankToSwap,
	roomIdx,
	round,
	teamIdx,
	teamsSortedByDescendingRank
}: {
	currentConflict: Conflict;
	matches: Matches;
	rankToSwap: number;
	roomIdx: number;
	round: TeamEntry[][];
	teamIdx: number;
	teamsSortedByDescendingRank: TeamEntry[];
}): TeamEntry[][] | undefined => {
	// if swap team is in the same room, then skip this one
	if (teamsSortedByDescendingRank.find(team => team.rank === rankToSwap)) {
		return;
	}

	// find team with rankToSwap
	for (let swapRoomIdx = 0; swapRoomIdx < round.length; swapRoomIdx++) {
		if (swapRoomIdx === roomIdx) {
			continue;
		}

		for (
			let swapTeamIdx = 0;
			swapTeamIdx < round[swapRoomIdx].length;
			swapTeamIdx++
		) {
			if (round[swapRoomIdx][swapTeamIdx].rank === rankToSwap) {
				const swappedRound = swapTeams(
					round,
					{ roomIdx, teamIdx },
					{ roomIdx: swapRoomIdx, teamIdx: swapTeamIdx }
				);
				const newConflict = calculateConflict(swappedRound, matches);
				if (newConflict.total < currentConflict.total) {
					return swappedRound;
				} else {
					return;
				}
			}
		}
	}
};

export const swapTeams = (
	round: TeamEntry[][],
	team1: { roomIdx: number; teamIdx: number },
	team2: { roomIdx: number; teamIdx: number }
): TeamEntry[][] => {
	if (
		team1.roomIdx >= round.length ||
		team2.roomIdx >= round.length ||
		team1.teamIdx >= round[team1.roomIdx].length ||
		team2.teamIdx >= round[team2.roomIdx].length
	) {
		throw new Error("Invalid team");
	}

	return round.map((room, idx) => {
		let result = [...room];
		if (idx === team1.roomIdx) {
			result[team1.teamIdx] = round[team2.roomIdx][team2.teamIdx];
		} else if (idx === team2.roomIdx) {
			result[team2.teamIdx] = round[team1.roomIdx][team1.teamIdx];
		}
		return result;
	});
};

const pittingService = {
	generateInitialPittings: (ladder: LadderType | undefined): string[][][] => {
		if (!ladder?.teams || Object.keys(ladder.teams).length < 2) {
			return [];
		}
		const orderedTeams: string[] = Object.keys(ladder.teams)
			.sort()
			// @ts-ignore
			.map((letter: string) => ladder.teams[letter]);
		const originalOrderedTeams = [...orderedTeams];

		if (orderedTeams.length % 3 !== 0) {
			orderedTeams.push(NOT_A_TEAM);
			if (orderedTeams.length % 3 !== 0) {
				orderedTeams.splice(orderedTeams.length - 5, 0, NOT_A_TEAM);
			}
		} else if (orderedTeams.length === 6) {
			orderedTeams.push(NOT_A_TEAM);
			orderedTeams.splice(2, 0, NOT_A_TEAM);
			orderedTeams.splice(5, 0, NOT_A_TEAM);
		}

		const result: string[][][] = [[]];
		for (let i = 0; i < orderedTeams.length; i += 3) {
			let pitting: string[] = [];
			pushIfTeam(orderedTeams[i], pitting);
			pushIfTeam(orderedTeams[i + 1], pitting);
			if (orderedTeams.length > i + 2) {
				pushIfTeam(orderedTeams[i + 2], pitting);
			}
			result[0].push(pitting);
		}

		// traditional ladder
		if (ladder.type === 0 && ladder.rounds > 1) {
			if (isSpecialCase(originalOrderedTeams.length)) {
				result.push(
					...handleSpecialCase(
						originalOrderedTeams.length,
						originalOrderedTeams
					)
				);
			} else {
				for (let i = 1; i < ladder.rounds; i++) {
					let round: string[][] = [];
					for (let j = 2; j < orderedTeams.length; j += 3) {
						let teams: string[] = [];
						pushIfTeam(orderedTeams[j], teams);
						pushIfTeam(
							orderedTeams[(j + 2 + (i - 1) * 3) % orderedTeams.length],
							teams
						);
						pushIfTeam(
							orderedTeams[(j + 4 + (i - 1) * 6) % orderedTeams.length],
							teams
						);
						round.push(teams);
					}
					result.push(round);
				}
			}
		}

		return result;
	},
	generateNextSwissRound: (ladder: LadderType): string[][] => {
		const teams: ScoreRow[] = calculateScores(ladder).sort(sortScores);
		let round: string[][] = [];
		for (let i = 0; i < teams.length; i += 3) {
			const room = [teams[i].team];
			if (teams.length > i + 1) {
				room.push(teams[i + 1].team);

				if (teams.length > i + 2) {
					room.push(teams[i + 2].team);
				}
			} else {
				// @ts-ignore
				room.unshift(round[round.length - 1].pop());
			}

			round.push(room);
		}

		if (ladder.matches) {
			round = deconflictRound(
				round.map((room, roomIdx) =>
					room.map((team, teamIdx) => ({
						team,
						rank: roomIdx * 3 + teamIdx + 1
					}))
				),
				ladder.matches
			);
		}

		return round;
	}
};

export default pittingService;
