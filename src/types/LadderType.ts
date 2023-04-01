type Teams = { [letter: string]: string };

type LadderType = {
	id: string;
	divisions?: number;
	draw: number;
	name: string;
	rooms?: string[]; // should be undefined for multiple divisions
	rounds: number;
	type: number;
	teams?: Teams | { division: string; teams: Teams; rooms?: string[] }[];
};

export default LadderType;
