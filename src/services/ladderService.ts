import { useEffect, useState } from "react";
import LadderType, { Ladder } from "../types/LadderType";
import scoreSheetService from "./scoreSheetService";
import Round, { RoundOutput } from "../types/Round";

export const BACKEND_URL =
	process.env.NODE_ENV === "production"
		? "https://txclassics.org"
		: "http://localhost";

const STORAGE_ITEM = "certamen-ladder.ladders";

const updateScoresheets = (ladder: Ladder, skipEdit?: boolean) => {
	let edited = false;
	ladder.divisions = ladder.divisions?.map(division => {
		division.matches = division.matches?.map(round => {
			return round.map(room => {
				if (room.scoresheetId && !room.scoresheetOverridden) {
					const scoreSheet = scoreSheetService.getScoreSheet(room.scoresheetId);
					if (scoreSheet) {
						const scores = scoreSheet.scores;
						room.teams = scoreSheet.teams.map((team, idx) => ({
							team: team.name,
							score: scores[idx]
						}));
						edited = true;
					}
				}
				return room;
			});
		});
		return division;
	});

	if (edited && !skipEdit) {
		editLadder(ladder);
	}
};

const getLadders = (skipEdit?: boolean): Ladder[] => {
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
	const ladders: Ladder[] = getLadders(true);
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

const saveScoreSheets = (scoreSheets: RoundOutput[]) => {
	scoreSheets.forEach((scoreSheet: RoundOutput) => {
		if (scoreSheet && scoreSheet.password) {
			scoreSheetService.updateScoreSheet(
				scoreSheet.id,
				new Round(scoreSheet.id, scoreSheet.teams, scoreSheet.questions),
				scoreSheet.password
			);
		}
	});
};

const getPublicLadder = async (id: string): Promise<Ladder | undefined> => {
	const response = await window.fetch(
		`${BACKEND_URL}/api/certamen/ladders.php?id=${id}&expand=scoreSheets`,
		{
			method: "GET"
		}
	);

	const json = await response.json();
	if (json.scoreSheets) {
		saveScoreSheets(json.scoreSheets);
	}
	return new Ladder(json.ladder);
};

const ladderService = {
	getLadders,
	addLadder,
	getLadder: (id: string, publicId?: string): Ladder | undefined => {
		if (publicId) {
			getPublicLadder(publicId);
		}
		const ladder = getLadders().find(l => l.id === id);
		return ladder;
	},
	getPublicLadder,
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

export const useLadder = ({
	ladderId,
	publicLadderId
}: {
	ladderId?: string | null;
	publicLadderId?: string | null;
}) => {
	const [ladder, setLadder] = useState<Ladder | undefined>();
	const updateLadder = () => {
		let l;
		if (ladderId) {
			l = ladderService.getLadder(ladderId);
			setLadder(l);
		} else if (publicLadderId) {
			ladderService.getPublicLadder(publicLadderId).then(setLadder);
		}

		if (l) {
			updateScoresheets(l);
		} else if (ladder) {
			updateScoresheets(ladder);
		}
	};

	useEffect(() => {
		const updateAndSchedule = () => {
			updateLadder();
			const timeout = setTimeout(updateAndSchedule, 10000);
			return () => clearTimeout(timeout);
		};

		const cleanup = updateAndSchedule();
		return cleanup;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { ladder, updateLadder };
};

export default ladderService;
