import { DrawType, LadderStyle, drawTypes, ladderTypes } from "../constants";
import Matches, { MatchesV2 } from "./Matches";
import Teams from "./Teams";

export interface LadderTypeV2 {
	id: string;
	publicId?: string;
	name: string;
	divisions?: {
		division?: string;
		teams: Teams;
		threeRooms?: boolean;
		rooms?: string[];
		matches?: MatchesV2;
	}[];
	drawType: DrawType;
	ladderType: LadderStyle;
	numRounds: number;
}

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

export interface Division {
	division?: string;
	teams: Teams;
	threeRooms?: boolean;
	rooms?: string[];
	matches?: MatchesV2;
}

export class Ladder implements LadderTypeV2 {
	public id: string;
	public publicId?: string;
	public name: string;
	public divisions?: Division[];
	public drawType: DrawType;
	public ladderType: LadderStyle;
	public numRounds: number;

	constructor(ladder: LadderType | LadderTypeV2) {
		this.id = ladder.id;
		this.publicId = ladder.publicId;
		this.name = ladder.name;

		if ("drawType" in ladder) {
			// LadderTypeV2
			this.divisions = ladder.divisions;
			this.drawType = ladder.drawType;
			this.ladderType = ladder.ladderType;
			this.numRounds = ladder.numRounds;
		} else {
			this.drawType = drawTypes[ladder.draw] as DrawType;
			this.ladderType = ladderTypes[ladder.type] as LadderStyle;
			this.numRounds = ladder.rounds;
			if (ladder.divisions) {
				// multi-division
				if (ladder.teams) {
					this.divisions = (
						ladder.teams as {
							division: string;
							teams: Teams;
							threeRooms?: boolean;
							rooms?: string[];
							matches?: Matches;
						}[]
					)?.map(division => ({
						division: division.division,
						teams: division.teams,
						threeRooms: division.threeRooms,
						rooms: division.rooms,
						matches: division.matches?.map(round =>
							round.map(room => ({ teams: room.map(team => team) }))
						)
					}));
				} else {
					this.divisions = [];
					for (let i = 0; i < ladder.divisions; i++) {
						this.divisions.push({ teams: {} });
					}
				}
			} else {
				// single division
				this.divisions = [
					{
						teams: ladder.teams as Teams,
						threeRooms: ladder.threeRooms,
						rooms: ladder.rooms,
						matches: ladder.matches?.map(round =>
							round.map(room => ({ teams: room.map(team => team) }))
						)
					}
				];
			}
		}
	}

	calculateStatus(): LadderStatus {
		if (
			!this.divisions?.length ||
			this.divisions.some(division => !division.teams)
		) {
			return LadderStatus.CREATED;
		}

		const roundsPlayed: number | undefined = this.calculateRoundsPlayed();
		if (!roundsPlayed) {
			return LadderStatus.DRAWN;
		}

		if ((roundsPlayed || 0) < this.numRounds) {
			return LadderStatus.IN_PROGRESS;
		}

		return LadderStatus.DONE;
	}

	calculateTeams(): number | undefined {
		if (!this.divisions?.length) {
			return;
		}

		return this.divisions.reduce(
			(acc, division) =>
				acc + (division.teams ? Object.keys(division.teams).length : 0),
			0
		);
	}

	calculateRoundsPlayed(): number | undefined {
		if (!this.divisions?.length) {
			return;
		}
		let roundsPlayed: number | undefined;
		for (const division of this.divisions) {
			if (!division.matches) {
				continue;
			}
			const divisionRoundsPlayed = division.matches.reduce((acc, round) => {
				if (
					round.some(room =>
						room.teams.some(team => team.score && team.score > 0)
					)
				) {
					return acc + 1;
				}
				return acc;
			}, 0);
			if (roundsPlayed === undefined || divisionRoundsPlayed > roundsPlayed) {
				roundsPlayed = divisionRoundsPlayed;
			}
		}
		return roundsPlayed;
	}

	isSwiss(): boolean {
		return (
			this.ladderType === LadderStyle.SWISS ||
			this.ladderType === LadderStyle.SWISS_BY_POINTS
		);
	}
}

export default LadderType;
