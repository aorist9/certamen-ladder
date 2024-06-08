import Round, { RoundOutput } from "../types/Round";

const STORAGE_ITEM = "certamen-ladder.score-sheets";

const getScoreSheets = (): Round[] => {
	const scoreSheetsJson: string | null =
		window.localStorage.getItem(STORAGE_ITEM);
	return JSON.parse(scoreSheetsJson || "[]").map(
		(scoreSheet: RoundOutput) =>
			new Round(scoreSheet.id, scoreSheet.teams, scoreSheet.questions)
	);
};

const addScoreSheet = (scoreSheet: RoundOutput) => {
	window.localStorage.setItem(
		STORAGE_ITEM,
		JSON.stringify([
			scoreSheet,
			...getScoreSheets().map(s => s.toOutputObject())
		])
	);
};

const scoreSheetService = {
	addScoreSheet,
	getScoreSheet: (id: string): Round | undefined => {
		return getScoreSheets().find(scoreSheet => scoreSheet.id === id);
	},
	updateScoreSheet: (id: string, scoreSheet: Round, isPublic: boolean) => {
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
		} else {
			addScoreSheet(scoreSheet.toOutputObject());
		}
	}
};

export default scoreSheetService;
