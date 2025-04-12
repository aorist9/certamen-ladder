import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import Round, { Question, Team } from "../types/Round";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import scoreSheetService from "../services/scoreSheetService";
import { EMPTY_QUESTIONS } from "../constants";

const RoundContext = createContext<{
	questions: Question[];
	scores: number[];
	setQuestions: (questions: Question[]) => void;
	setTeams: (teams: Team[]) => void;
	teamOrder: string[];
	teams: Team[];
}>({
	questions: [],
	scores: [],
	setQuestions: () => {},
	setTeams: () => {},
	teamOrder: [],
	teams: []
});

export const RoundContextProvider = ({ children }: PropsWithChildren) => {
	const [query] = useSearchParams();

	const roundId = query.get("round");
	const isDemo = !!query.get("demo");

	const ladder = ladderService.getLadder(query.get("ladder") || "");
	const scoreSheet = roundId
		? scoreSheetService.getScoreSheet(roundId)
		: undefined;

	const [teams, setTeams] = useState(
		isDemo
			? ["Team", "Other Team", "Yet Another Team"].map(team => ({
					name: team,
					players: Array(4).fill({ name: "", isCaptain: false })
			  }))
			: scoreSheet?.teams
	);
	const [questions, setQuestions] = useState(
		scoreSheet?.questions || EMPTY_QUESTIONS
	);

	const round = useMemo(
		() => new Round(roundId || "demo", teams || [], questions),
		[roundId, teams, questions]
	);

	const ladderId = ladder?.id;
	useEffect(() => {
		if (scoreSheet && scoreSheet.id !== "demo" && teams && teams.length) {
			scoreSheetService.updateScoreSheet(scoreSheet.id, round, ladderId);
		}
	}, [ladderId, round, scoreSheet, teams]);

	if (teams && teams.length && (roundId || isDemo)) {
		return (
			<RoundContext.Provider
				value={{
					questions: round.questions,
					scores: round.scores,
					setQuestions: (questions: Question[]) => {
						setQuestions(questions);
						round.questions = questions;
						scoreSheetService.updateScoreSheet(round.id, round, ladderId);
					},
					setTeams,
					teamOrder: round.teamOrder,
					teams: round.teams
				}}
			>
				{children}
			</RoundContext.Provider>
		);
	} else {
		return <p>You may have reached this page in error</p>;
	}
};

export const useRoundContext = () => {
	return useContext(RoundContext);
};
