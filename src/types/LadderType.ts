import Matches from "./Matches";
import Teams from "./Teams";

type LadderType = {
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
};

export default LadderType;
