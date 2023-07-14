import LadderType from "../types/LadderType";

const STORAGE_ITEM = "certamen-ladder.ladders";

const getLadders = (): LadderType[] => {
	const laddersJson: string | null = window.localStorage.getItem(STORAGE_ITEM);
	return JSON.parse(laddersJson || "[]");
};

const addLadder = (ladder: LadderType): void => {
	window.localStorage.setItem(
		STORAGE_ITEM,
		JSON.stringify([ladder, ...getLadders()])
	);
};

const editLadder = (ladder: LadderType): void => {
	const ladders: LadderType[] = getLadders();
	const existingLadder: LadderType | undefined = ladders.find(
		l => l.id === ladder.id
	);
	if (existingLadder) {
		const idx = ladders.indexOf(existingLadder);
		window.localStorage.setItem(
			STORAGE_ITEM,
			JSON.stringify([
				...ladders.slice(0, idx),
				ladder,
				...ladders.slice(idx + 1)
			])
		);
	} else {
		addLadder(ladder);
	}

	console.log("Hello there");
	if (ladder.publicId) {
		console.log("General Kenobi");
		window.fetch(`${BACKEND_URL}/api/certamen/ladders.php`, {
			method: "PUT",
			body: JSON.stringify(ladder)
		});
	}
};

const BACKEND_URL =
	process.env.NODE_ENV === "production"
		? "https://txclassics.org"
		: "http://localhost";

const publishLadder = async (ladder: LadderType): Promise<LadderType> => {
	const response = await window.fetch(
		`${BACKEND_URL}/api/certamen/ladders.php`,
		{
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(ladder)
		}
	);
	const json = await response.json();
	const updatedLadder: LadderType = { ...ladder, publicId: json.id };
	editLadder(updatedLadder);
	return updatedLadder;
};

const ladderService = {
	getLadders,
	addLadder,
	getLadder: (id: string): LadderType | undefined => {
		return getLadders().find(l => l.id === id);
	},
	getPublicLadder: async (id: string): Promise<LadderType | undefined> => {
		const response = await window.fetch(
			`${BACKEND_URL}/api/certamen/ladders.php?id=${id}`,
			{
				method: "GET"
			}
		);

		const json = await response.json();
		return json.ladder;
	},
	editLadder,
	deleteLadder: (id: string) => {
		const ladders: LadderType[] = getLadders();
		window.localStorage.setItem(
			STORAGE_ITEM,
			JSON.stringify(ladders.filter((ladder: LadderType) => ladder.id !== id))
		);
	},
	publishLadder
};

export default ladderService;
