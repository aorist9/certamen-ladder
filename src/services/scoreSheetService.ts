import Round, { RoundOutput } from "../types/Round";
import { BACKEND_URL } from "./ladderService";

const STORAGE_ITEM = "certamen-ladder.score-sheets";

const getScoreSheets = (): Round[] => {
	const scoreSheetsJson: string | null =
		window.localStorage.getItem(STORAGE_ITEM);
	return JSON.parse(scoreSheetsJson || "[]").map(
		(scoreSheet: RoundOutput) =>
			new Round(scoreSheet.id, scoreSheet.teams, scoreSheet.questions)
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
		window.fetch(`${BACKEND_URL}/api/certamen/score-sheets.php`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: scoreSheet.id,
				scoreSheet,
				ladderId
			})
		});
	}
};

const scoreSheetService = {
	addScoreSheet,
	getScoreSheet: (id: string): Round | undefined => {
		return getScoreSheets().find(scoreSheet => scoreSheet.id === id);
	},
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
