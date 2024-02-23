import LadderType from "../types/LadderType";
import calculateScores, {
	ScoreRow,
	sortScores
} from "../utils/calculateScores";
import Deconflicter from "./Deconflicter";
import { handleSpecialCase, isSpecialCase } from "./specialCases";

const NOT_A_TEAM = "NOT-A-TEAM";

const pushIfTeam = (team: string, array: string[]) => {
	if (team !== NOT_A_TEAM) {
		array.push(team);
	}
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
			// } else if (orderedTeams.length === 6) {
			// 	orderedTeams.push(NOT_A_TEAM);
			// 	orderedTeams.splice(2, 0, NOT_A_TEAM);
			// 	orderedTeams.splice(5, 0, NOT_A_TEAM);
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
			round = new Deconflicter(ladder.matches).deconflictRound(
				round.map((room, roomIdx) =>
					room.map((team, teamIdx) => ({
						team,
						rank: roomIdx * 3 + teamIdx + 1
					}))
				)
			);
		}

		return round;
	}
};

export default pittingService;
