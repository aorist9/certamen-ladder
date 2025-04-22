import Round, { RoundOutput } from "../types/Round";
import { BACKEND_URL } from "./ladderService";

const STORAGE_ITEM = "certamen-ladder.score-sheets";

const getScoreSheets = (): Round[] => {
	const scoreSheetsJson: string | null =
		window.localStorage.getItem(STORAGE_ITEM);
	return JSON.parse(scoreSheetsJson || "[]").map(
		(scoreSheet: RoundOutput) =>
			new Round(
				scoreSheet.id,
				scoreSheet.teams,
				scoreSheet.questions,
				scoreSheet.password
			)
	);
};

const addScoreSheet = (scoreSheet: RoundOutput, ladderId?: string) => {
	window.localStorage.setItem(
		STORAGE_ITEM,
		JSON.stringify([
			scoreSheet,
			...getScoreSheets().map(s => s.toOutputObject())
		])
	);

	if (ladderId) {
		window
			.fetch(`${BACKEND_URL}/api/certamen/score-sheets.php`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: scoreSheet.id,
					scoreSheet,
					ladderId
				})
			})
			.then(response => {
				response.json().then(json => {
					const scoreSheetsString = window.localStorage.getItem(STORAGE_ITEM);
					if (json.password && scoreSheetsString) {
						let scoreSheets = JSON.parse(scoreSheetsString);
						scoreSheets = scoreSheets.map((s: RoundOutput) => {
							if (s.id === scoreSheet.id) {
								return {
									...s,
									password: json.password
								};
							}
							return s;
						});
						window.localStorage.setItem(
							STORAGE_ITEM,
							JSON.stringify(scoreSheets)
						);
					}
				});
			});
	}
};

const getScoreSheetAsync = async (id: string): Promise<Round | undefined> => {
	let scoresheet;
	try {
		const response = await window.fetch(
			`${BACKEND_URL}/api/certamen/score-sheets.php?id=${id}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" }
			}
		);
		if (!response.ok) {
			return;
		}
		const json = await response.json();
		scoresheet = json.scoreSheet;
	} catch (error) {
		console.error("Error fetching scoresheet:", error);
	}

	if (scoresheet) {
		const scoreSheets = getScoreSheets();
		const existingScoreSheet = scoreSheets.find(s => s.id === scoresheet.id);

		const scoreSheet = new Round(
			scoresheet.id,
			scoresheet.teams,
			scoresheet.questions,
			existingScoreSheet?.password
		);
		window.localStorage.setItem(
			STORAGE_ITEM,
			JSON.stringify([
				scoreSheet.toOutputObject(),
				...scoreSheets
					.filter(r => r.id !== scoreSheet.id)
					.map(s => s.toOutputObject())
			])
		);
		return scoreSheet;
	}
};

const scoreSheetService = {
	addScoreSheet,
	confirmPassword: async (id: string, password: string) => {
		try {
			const response = await window.fetch(
				`${BACKEND_URL}/api/certamen/score-sheets/password.php`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id,
						password
					})
				}
			);
			if (response.ok) {
				return true;
			}
		} catch (error) {
			console.error("Error fetching scoresheet:", error);
		}

		return false;
	},
	getScoreSheet: (id: string): Round | undefined => {
		getScoreSheetAsync(id);
		return getScoreSheets().find(scoreSheet => scoreSheet.id === id);
	},
	getScoreSheetAsync,
	updateScoreSheet: (id: string, scoreSheet: Round, ladderId?: string) => {
		const scoreSheets = getScoreSheets();
		const existingScoreScheet = scoreSheets.find(
			scoreSheet => scoreSheet.id === id
		);
		if (existingScoreScheet) {
			const idx = scoreSheets.indexOf(existingScoreScheet);
			window.localStorage.setItem(
				STORAGE_ITEM,
				JSON.stringify([
					...scoreSheets.slice(0, idx).map(s => s.toOutputObject()),
					scoreSheet.toOutputObject(),
					...scoreSheets.slice(idx + 1).map(s => s.toOutputObject())
				])
			);

			if (ladderId) {
				window.fetch(`${BACKEND_URL}/api/certamen/score-sheets.php`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id: scoreSheet.id,
						scoreSheet: scoreSheet.toOutputObject(),
						ladderId
					})
				});
			}
		} else {
			addScoreSheet(scoreSheet.toOutputObject(), ladderId);
		}
	}
};

export default scoreSheetService;
