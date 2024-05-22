import { MatchesV2 } from "../types/Matches";

type Conflict = { total: number; roundConflicts: number[] };
export type TeamEntry = { team: string; rank: number };

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

class Deconflicter {
	private matches: MatchesV2;

	constructor(matches: MatchesV2) {
		this.matches = matches;
	}

	calculateSinglePittingConflict(pitting: string[]): number {
		const conflictCount = this.matches.reduce(
			(acc, round) =>
				acc +
				round.reduce((roundAcc, matchup) => {
					let rawConflict: number = matchup.teams.reduce(
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
	}

	calculateConflict(proposedRound: TeamEntry[][]): Conflict {
		const result: Conflict = {
			total: 0,
			roundConflicts: []
		};
		proposedRound.forEach(pitting => {
			let conflictCount: number = this.calculateSinglePittingConflict(
				pitting.map(t => t.team)
			);
			result.total += conflictCount;
			result.roundConflicts.push(conflictCount);
		});
		return result;
	}

	deconflictRound(round: TeamEntry[][]): string[][] {
		const currentConflict: Conflict = this.calculateConflict(round);
		const totalTeams = this.matches[0].reduce(
			(acc, room) => acc + room.teams.length,
			0
		);

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
				const longestSwapDistance = round[roomIdx].reduce((acc, t) => {
					const distance = Math.max(t.rank - 1, totalTeams - t.rank);
					return Math.max(acc, distance);
				}, 0);

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
						const successfulSwap: TeamEntry[][] | undefined = this.swapByRank({
							currentConflict,
							rankToSwap,
							roomIdx,
							round,
							teamIdx,
							teamsSortedByDescendingRank
						});
						if (successfulSwap) {
							return this.deconflictRound(successfulSwap);
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
						const successfulSwap: TeamEntry[][] | undefined = this.swapByRank({
							currentConflict,
							rankToSwap,
							roomIdx,
							round,
							teamIdx,
							teamsSortedByDescendingRank
						});
						if (successfulSwap) {
							return this.deconflictRound(successfulSwap);
						}
					}
				}
			}
		}
		return round.map(room => room.map(team => team.team));
	}

	swapByRank = ({
		currentConflict,
		rankToSwap,
		roomIdx,
		round,
		teamIdx,
		teamsSortedByDescendingRank
	}: {
		currentConflict: Conflict;
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
					const newConflict = this.calculateConflict(swappedRound);
					if (newConflict.total < currentConflict.total) {
						return swappedRound;
					} else {
						return;
					}
				}
			}
		}
	};
}

export default Deconflicter;
