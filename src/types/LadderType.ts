type LadderType = {
	id: string;
	divisions?: number;
	draw: number;
	name: string;
	rounds: number;
	type: number;
	teams?: { [letter: string]: string };
};

export default LadderType;
