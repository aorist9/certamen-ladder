import Matches from "./Matches";
import Teams from "./Teams";

interface LadderType {
	id: string;
	divisions?: number;
	draw: number;
	name: string;
	matches?: Matches; // should be undefined for multiple divisions
	rooms?: string[]; // should be undefined for multiple divisions
	rounds: number;
	type: number;
	teams?:
		| Teams
		| {
				division: string;
				teams: Teams;
				rooms?: string[];
				matches?: Matches;
		  }[];
}

export enum LadderStatus {
	CREATED = "Created",
	DRAWN = "Drawn",
	IN_PROGRESS = "In Progress",
	DONE = "Done"
}

export class Ladder implements LadderType {
	public id: string;
	public divisions?: number;
	public draw: number;
	public name: string;
	public matches?: Matches; // should be undefined for multiple divisions
	public rooms?: string[]; // should be undefined for multiple divisions
	public rounds: number;
	public type: number;
	public teams?:
		| Teams
		| {
				division: string;
				teams: Teams;
				rooms?: string[];
				matches?: Matches;
		  }[];

	constructor(ladderType: LadderType) {
		this.id = ladderType.id;
		this.divisions = ladderType.divisions;
		this.draw = ladderType.draw;
		this.name = ladderType.name;
		this.matches = ladderType.matches;
		this.rooms = ladderType.rooms;
		this.rounds = ladderType.rounds;
		this.type = ladderType.type;
		this.teams = ladderType.teams;
	}

	calculateStatus(): LadderStatus {
		if (!this.teams) {
			return LadderStatus.CREATED;
		}

		const roundsPlayed: number | undefined = this.calculateRoundsPlayed();
		if (!roundsPlayed) {
			return LadderStatus.DRAWN;
		}

		if ((roundsPlayed || 0) < this.rounds) {
			return LadderStatus.IN_PROGRESS;
		}

		return LadderStatus.DONE;
	}

	calculateTeams(): number | undefined {
		if (!this.teams) {
			return;
		}

		if (Array.isArray(this.teams)) {
			return this.teams.reduce(
				(acc, division) => acc + Object.keys(division).length,
				0
			);
		} else {
			return Object.keys(this.teams).length;
		}
	}

	calculateRoundsPlayed(): number | undefined {
		if (this.matches) {
			return this.matches.reduce((acc, round) => {
				if (round.find(room => room.find(team => team.score !== undefined))) {
					return acc + 1;
				} else {
					return acc;
				}
			}, 0);
		} else {
			return;
		}
	}
}

export default LadderType;
