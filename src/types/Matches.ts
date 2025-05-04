export interface MatchTeam {
	team: string;
	score?: number;
	swissPoints?: number;
}

type Matches = MatchTeam[][][];

export interface RoomV2 {
	teams: MatchTeam[];
	scoresheetId?: string;
	scoresheetOverridden?: boolean;
}
export type MatchesV2 = RoomV2[][];

export default Matches;
