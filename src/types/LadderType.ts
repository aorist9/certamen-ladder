import Matches from "./Matches";
import Teams from "./Teams";

// interface SingleDivisionLadder { // TODO use this scheme once we can figure out how to incorporate the Ladder class into it
// 	id: string;
// 	draw: number;
// 	name: string;
// 	matches?: Matches;
// 	publicId?: string;
// 	rooms?: string[];
// 	rounds: number;
// 	type: number;
// 	threeRooms?: boolean;
// 	teams?: Teams;
// }

// interface MultipleDivisionLadder {
// 	id: string;
// 	divisions: number;
// 	draw: number;
// 	name: string;
// 	rounds: number;
// 	type: number;
// 	teams: {
// 		division: string;
// 		teams: Teams;
// 		threeRooms?: boolean;
// 		rooms?: string[];
// 		matches?: Matches;
// 	}[];
// }

// type LadderType = SingleDivisionLadder | MultipleDivisionLadder;
interface LadderType {
	id: string;
	divisions?: number;
	draw: number;
	name: string;
	matches?: Matches; // should be undefined for multiple divisions
	publicId?: string; // should be undefined unless the ladder is published
	rooms?: string[]; // should be undefined for multiple divisions
	rounds: number;
	type: number;
	threeRooms?: boolean;
	teams?:
		| Teams
		| {
				division: string;
				teams: Teams;
				threeRooms?: boolean;
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
	public publicId?: string; // should be undefined unless the ladder is published
	public rooms?: string[]; // should be undefined for multiple divisions
	public rounds: number;
	public type: number;
	public threeRooms?: boolean;
	public teams?:
		| Teams
		| {
				division: string;
				teams: Teams;
				threeRooms?: boolean;
				rooms?: string[];
				matches?: Matches;
		  }[];

	constructor(ladderType: LadderType) {
		this.id = ladderType.id;
		this.publicId = ladderType.publicId;
		this.divisions = ladderType.divisions;
		this.draw = ladderType.draw;
		this.name = ladderType.name;
		this.matches = ladderType.matches;
		this.rooms = ladderType.rooms;
		this.rounds = ladderType.rounds;
		this.type = ladderType.type;
		this.threeRooms = ladderType.threeRooms;
		this.teams = ladderType.teams;
	}

	calculateStatus(): LadderStatus {
		if (
			!this.teams ||
			(typeof this.teams === "object" && !Object.keys(this.teams).length) ||
			(Array.isArray(this.teams) && !Object.keys(this.teams[0].teams).length)
		) {
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
