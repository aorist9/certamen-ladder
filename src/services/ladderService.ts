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

const ladderService = {
	getLadders,
	addLadder,
	getLadder: (id: string): LadderType | undefined => {
		return getLadders().find(l => l.id === id);
	},
	editLadder: (ladder: LadderType): void => {
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
	},
	deleteLadder: (id: string) => {
		const ladders: LadderType[] = getLadders();
		window.localStorage.setItem(
			STORAGE_ITEM,
			JSON.stringify(ladders.filter((ladder: LadderType) => ladder.id !== id))
		);
	}
};

export default ladderService;
