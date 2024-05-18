import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useState
} from "react";
import Round, { Question, Team } from "../types/Round";

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

export const RoundContextProvider = ({
	children,
	teams: inputTeams
}: PropsWithChildren & { teams: string[] }) => {
	const [teams, setTeams] = useState(
		inputTeams.map(team => ({
			name: team,
			players: Array(4).fill({ name: "", isCaptain: false })
		}))
	);
	const [questions, setQuestions] = useState(
		Array(20).fill({ buzzes: [], boni: [] })
	);

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
};

export const useRoundContext = () => {
	return useContext(RoundContext);
};
