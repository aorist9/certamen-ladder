import LadderType, { Ladder } from "../types/LadderType";

const STORAGE_ITEM = "certamen-ladder.ladders";

const getLadders = (): Ladder[] => {
	const laddersJson: string | null = window.localStorage.getItem(STORAGE_ITEM);
	return JSON.parse(laddersJson || "[]").map(
		(ladder: LadderType) => new Ladder(ladder)
	);
};

const addLadder = (ladder: Ladder): void => {
	window.localStorage.setItem(
		STORAGE_ITEM,
		JSON.stringify([ladder, ...getLadders()])
	);
};

const editLadder = (ladder: Ladder): void => {
	const ladders: Ladder[] = getLadders();
	const existingLadder: Ladder | undefined = ladders.find(
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

	if (ladder.publicId) {
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

const publishLadder = async (ladder: Ladder): Promise<Ladder> => {
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
	ladder.publicId = json.id;
	editLadder(ladder);
	return ladder;
};

const ladderService = {
	getLadders,
	addLadder,
	getLadder: (id: string): Ladder | undefined => {
		return getLadders().find(l => l.id === id);
	},
	getPublicLadder: async (id: string): Promise<Ladder | undefined> => {
		const response = await window.fetch(
			`${BACKEND_URL}/api/certamen/ladders.php?id=${id}`,
			{
				method: "GET"
			}
		);

		const json = await response.json();
		return new Ladder(json.ladder);
	},
	editLadder,
	deleteLadder: (id: string) => {
		const ladders: Ladder[] = getLadders();
		window.localStorage.setItem(
			STORAGE_ITEM,
			JSON.stringify(ladders.filter((ladder: Ladder) => ladder.id !== id))
		);
	},
	publishLadder
};

export default ladderService;
