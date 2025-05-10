import { LadderStyle } from "../constants";
import { Ladder } from "../types/LadderType";
import calculateScores, {
	ScoreRow,
	sortScores
} from "../utils/calculateScores";
import Deconflicter from "./Deconflicter";
import { handleSpecialCase, isSpecialCase } from "./specialCases";

const NOT_A_TEAM = "NOT-A-TEAM";
const TEAMS_PER_ROOM = 3;

const pushIfTeam = (team: string, array: string[]) => {
	if (team !== NOT_A_TEAM) {
		array.push(team);
	}
};

const addPlaceholderTeams = (
	teams: string[],
	threeRooms?: boolean
): string[] => {
	if (teams.length % TEAMS_PER_ROOM !== 0) {
		teams.push(NOT_A_TEAM);
		if (teams.length % TEAMS_PER_ROOM !== 0) {
			teams.splice(teams.length - 5, 0, NOT_A_TEAM);
		}
	} else if (teams.length === 6 && threeRooms) {
		teams.push(NOT_A_TEAM);
		teams.splice(2, 0, NOT_A_TEAM);
		teams.splice(5, 0, NOT_A_TEAM);
	}
	return teams;
};

const pittingService = {
	generateInitialPittings: (
		ladder: Ladder | undefined,
		divisionNumber: number
	): string[][][] => {
		if (
			!ladder?.divisions ||
			ladder.divisions.length <= divisionNumber ||
			!ladder.divisions[divisionNumber].teams ||
			Object.keys(ladder.divisions[divisionNumber].teams).length < 2
		) {
			return [];
		}

		const division = ladder.divisions[divisionNumber];

		let orderedTeams: string[] = Object.keys(division.teams)
			.sort()
			.map(
				(letter: string) =>
					ladder.divisions?.[divisionNumber].teams[letter] as string
			);
		const originalOrderedTeams = [...orderedTeams];

		orderedTeams = addPlaceholderTeams(orderedTeams, division.threeRooms);

		const result: string[][][] = [[]];
		for (let i = 0; i < orderedTeams.length; i += TEAMS_PER_ROOM) {
			let pitting: string[] = [];
			pushIfTeam(orderedTeams[i], pitting);
			pushIfTeam(orderedTeams[i + 1], pitting);
			if (orderedTeams.length > i + 2) {
				pushIfTeam(orderedTeams[i + 2], pitting);
			}
			result[0].push(pitting);
		}

		if (ladder.ladderType === LadderStyle.TRADITIONAL && ladder.numRounds > 1) {
			if (isSpecialCase(originalOrderedTeams.length)) {
				result.push(
					...handleSpecialCase(
						originalOrderedTeams.length,
						originalOrderedTeams,
						division.threeRooms
					)
				);
			} else {
				for (let i = 1; i < ladder.numRounds; i++) {
					let round: string[][] = [];
					for (let j = 2; j < orderedTeams.length; j += TEAMS_PER_ROOM) {
						let teams: string[] = [];
						pushIfTeam(orderedTeams[j], teams);
						pushIfTeam(
							orderedTeams[
								(j + 2 + (i - 1) * TEAMS_PER_ROOM) % orderedTeams.length
							],
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
	generateNextSwissRound: (
		ladder: Ladder,
		divisionNumber: number
	): string[][] => {
		const division = ladder?.divisions?.[divisionNumber];
		if (!division) {
			return [];
		}

		const teams: ScoreRow[] = calculateScores(ladder, divisionNumber).sort(
			sortScores
		);
		let round: string[][] = [];
		for (let i = 0; i < teams.length; i += TEAMS_PER_ROOM) {
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

		if (division.matches) {
			round = new Deconflicter(division.matches).deconflictRound(
				round.map((room, roomIdx) =>
					room.map((team, teamIdx) => ({
						team,
						rank: roomIdx * TEAMS_PER_ROOM + teamIdx + 1
					}))
				)
			);
		}

		return round;
	}
};

export default pittingService;
