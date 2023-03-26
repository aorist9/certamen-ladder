type Teams = { [letter: string]: string };

type LadderType = {
	id: string;
	divisions?: number;
	draw: number;
	name: string;
	rounds: number;
	type: number;
	teams?: Teams | { division: string; teams: Teams }[];
};

export default LadderType;
