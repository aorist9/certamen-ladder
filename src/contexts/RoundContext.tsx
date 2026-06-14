import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import Round, { LETTERS, Question, Team } from "../types/Round";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import scoreSheetService from "../services/scoreSheetService";
import { EMPTY_QUESTIONS, NOT_A_TEAM } from "../constants";
import PasswordInput from "../components/ScoreSheet/PasswordInput";

const RoundContext = createContext<{
	isEditMode: boolean;
  ladderName: string | undefined;
	questions: Question[];
  roomName: string | undefined;
  roundNumber: number | undefined;
	scores: number[];
	teamOrder: string[];
	teams: Team[];
	setIsEditMode: (isEditMode: boolean) => void;
	setPassword: (password: string) => void;
	setQuestions: (questions: Question[]) => void;
	setTeams: (teams: Team[]) => void;
}>({
  isEditMode: false,
  ladderName: undefined,
	questions: [],
  roomName: undefined,
  roundNumber: undefined,
	scores: [],
	teamOrder: [],
	teams: [],
	setIsEditMode: (isEditMode: boolean): void => {},
	setPassword: () => {},
	setQuestions: () => {},
	setTeams: () => {},
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

  let initialTeams: Team[] = isDemo
			? ["Team", "Other Team", "Yet Another Team"].map((team, tIdx) => ({
					name: team,
					players: Array(4).fill({ name: "", isCaptain: false }),
          letter: LETTERS[tIdx]
			  }))
			: scoreSheet?.teams || [];

  while (initialTeams?.length < 4) {
    initialTeams.push(NOT_A_TEAM);
  }

	const [teams, rawSetTeams] = useState(initialTeams);
  const setTeams = (teams: Team[]) => {
    const newTeams = Array(4).fill(NOT_A_TEAM);
    teams.forEach((team, idx) => {
      if (team.letter) {
        newTeams[LETTERS.indexOf(team.letter)] = team;
      } else if (team.name !== NOT_A_TEAM.name) {
        newTeams[idx] = team;
      }
    });
    rawSetTeams(newTeams);
  }

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

  const { roomName, roundNumber }: {roomName: string | undefined; roundNumber: number | undefined} = useMemo(() => {
    if (ladder?.divisions) {
      for (let i = 0; i < ladder.divisions.length; i++) {
        if (!ladder.divisions[i].rooms) {
          continue;
        }

        let roundNumber;
        let index = ladder.divisions[i].matches?.findIndex(match => {
          let matched = match.findIndex(r => r.scoresheetId === roundId);
          if (matched !== undefined && matched >= 0) {
            roundNumber = matched + 1;
            return true;
          } else {
            return false;
          }
        });
        if (index !== undefined && index >= 0) {
          return { roomName: ladder.divisions[i].rooms?.[index], roundNumber };
        }
      }
    }

    return { roomName: undefined, roundNumber: undefined };
  }, [ladder?.divisions, roundId]);

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
		if (!isEditMode && roundId) {
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
          ladderName: ladder?.name,
					questions: round.questions,
          roomName,
          roundNumber,
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
