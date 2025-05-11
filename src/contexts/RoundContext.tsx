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
import PasswordInput from "../components/ScoreSheet/PasswordInput";

const RoundContext = createContext<{
	questions: Question[];
	scores: number[];
	setQuestions: (questions: Question[]) => void;
	setTeams: (teams: Team[]) => void;
	teamOrder: string[];
	teams: Team[];
	isEditMode: boolean;
	setIsEditMode: (isEditMode: boolean) => void;
	setPassword: (password: string) => void;
}>({
	questions: [],
	scores: [],
	setQuestions: () => {},
	setTeams: () => {},
	teamOrder: [],
	teams: [],
	setPassword: () => {},
	isEditMode: false,
	setIsEditMode: (isEditMode: boolean): void => {}
});

export const RoundContextProvider = ({ children }: PropsWithChildren) => {
	const [query] = useSearchParams();

	const roundId = query.get("round");
	const isDemo = !!query.get("demo");

	const [isEditMode, setIsEditMode] = useState(isDemo);
	const [editModeError, setEditModeError] = useState<string | undefined>();
	const [loading, setLoading] = useState(true);

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

	const [password, setPassword] = useState<string | undefined>(
		scoreSheet?.password
	);

	useEffect(() => {
		if (roundId && password) {
			scoreSheetService.confirmPassword(roundId, password).then(success => {
				if (success) {
					setEditModeError(undefined);
				} else {
					setEditModeError("Unauthorized");
					setIsEditMode(false);
					setPassword(undefined);
				}
			});
		}
	}, [password, roundId]);

	const round = useMemo(
		() => new Round(roundId || "demo", teams || [], questions, password),
		[roundId, teams, questions, password]
	);

	const ladderId = ladder?.id;
	useEffect(() => {
		if (
			scoreSheet &&
			scoreSheet.id !== "demo" &&
			teams &&
			teams.length &&
			password
		) {
			scoreSheetService.updateScoreSheet(
				scoreSheet.id,
				round,
				password,
				ladderId
			);
		}
	}, [ladderId, round, scoreSheet, teams, password]);

	useEffect(() => {
		if (roundId) {
			scoreSheetService.getScoreSheetAsync(roundId).then(updatedScoreSheet => {
				if (updatedScoreSheet) {
					setTeams(updatedScoreSheet.teams);
					setQuestions(updatedScoreSheet.questions);
				}
				setLoading(false);
			});
		}
		const interval = setInterval(() => {
			if (!isEditMode && roundId) {
				scoreSheetService
					.getScoreSheetAsync(roundId)
					.then(updatedScoreSheet => {
						if (updatedScoreSheet) {
							setTeams(updatedScoreSheet.teams);
							setQuestions(updatedScoreSheet.questions);
						}
					});
			}
		}, 60000);

		return () => clearInterval(interval);
	}, [isEditMode, roundId]);

	if (teams && teams.length && (roundId || isDemo)) {
		return (
			<RoundContext.Provider
				value={{
					questions: round.questions,
					scores: round.scores,
					setQuestions: (questions: Question[]) => {
						setQuestions(questions);
						round.questions = questions;
						if (password) {
							scoreSheetService.updateScoreSheet(
								round.id,
								round,
								password,
								ladderId
							);
						}
					},
					setTeams,
					teamOrder: round.teamOrder,
					teams: round.teams,
					isEditMode,
					setIsEditMode,
					setPassword
				}}
			>
				{isEditMode && !round.password && !isDemo ? (
					<PasswordInput />
				) : (
					<>
						<p className="error">{editModeError}</p>
						{children}
					</>
				)}
			</RoundContext.Provider>
		);
	} else if (loading) {
		return <p>Loading...</p>;
	} else {
		return <p>You may have reached this page in error</p>;
	}
};

export const useRoundContext = () => {
	return useContext(RoundContext);
};
