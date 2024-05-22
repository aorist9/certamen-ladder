import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useState
} from "react";
import Round, { Question, Team } from "../types/Round";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";

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

	const roundIdx = query.get("round");
	const roomIdx = query.get("room");
	const divisionIdx = query.get("division");
	const isDemo = !!query.get("demo");

	const ladder = ladderService.getLadder(query.get("ladder") || "");
	const inputTeams = isDemo
		? ["Team", "Other Team", "Yet Another Team"]
		: roomIdx && roundIdx
		? ladder?.divisions?.[divisionIdx ? parseInt(divisionIdx) : 0]?.matches?.[
				parseInt(roundIdx)
		  ]?.[parseInt(roomIdx)]?.teams?.map(team => team.team)
		: [];

	const [teams, setTeams] = useState(
		inputTeams?.map(team => ({
			name: team,
			players: Array(4).fill({ name: "", isCaptain: false })
		}))
	);
	const [questions, setQuestions] = useState(
		Array(20).fill({ buzzes: [], boni: [] })
	);

	if (teams && teams.length) {
		const round = new Round(teams, questions);

		return (
			<RoundContext.Provider
				value={{
					questions: round.questions,
					scores: round.scores,
					setQuestions,
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
