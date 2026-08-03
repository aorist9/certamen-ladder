import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LETTERS, Question } from "../../types/Round";
import { useRoundContext } from "../../contexts/RoundContext";
import BonusCheckboxSection from "./BonusCheckboxSection";
import CommentSection from "./CommentSection";
import NavigationPanel from "./NavigationPanel";
import EditSection from "./EditSection";
import TimerSection from "./TimerSection";
import { NOT_A_TEAM } from "../../constants";

enum State {
	TOSSUP,
	BONI,
	EDITING
}

const CurrentQuestion = ({
	currentQuestion,
	setCurrentQuestion
}: {
	currentQuestion: number;
	setCurrentQuestion: (current: number) => void;
}) => {
	const { questions, setQuestions, teams } = useRoundContext();
	const [state, setState] = useState(State.TOSSUP);
	const [buzzer, setBuzzer] = useState<string | undefined>();

	const updateCurrentQuestion = (question: Question) => {
		setQuestions([
			...questions.slice(0, currentQuestion),
			question,
			...questions.slice(currentQuestion + 1)
		]);
	};

	const headerRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		if (buzzer || state === State.BONI) {
			headerRef.current?.scrollTo();
		}
	}, [buzzer, state, headerRef]);

	const getTeamColor = (teamIdx: number) => {
		switch (teamIdx) {
			case 0:
				return "error";
			case 1:
				return "primary";
			case 2:
				return "success";
			case 3:
				return "secondary";
		}
	};

	if (state === State.BONI) {
		return (
			<Stack className="current-tossup boni" sx={{ my: "1rem" }}>
				<Typography variant="h3" ref={headerRef} sx={{ fontSize: "2rem" }}>
					Tossup {currentQuestion + 1}: Boni to{" "}
					{questions[currentQuestion].correctTeam}
				</Typography>
				<Stack
					direction="row"
					sx={{
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					<BonusCheckboxSection
						done={(boni: boolean[]) => {
							updateCurrentQuestion({
								...questions[currentQuestion],
								boni
							});
							setState(State.TOSSUP);
							if (questions.length - currentQuestion > 1) {
								setCurrentQuestion(currentQuestion + 1);
							}
							setBuzzer(undefined);
						}}
					/>
					<TimerSection />
				</Stack>
				<CommentSection
					comment={questions[currentQuestion].comments}
					setComment={(comments: string) => {
						updateCurrentQuestion({
							...questions[currentQuestion],
							comments
						});
					}}
				/>
			</Stack>
		);
	} else if (state === State.EDITING) {
		return (
			<Stack
				className="current-tossup editing"
				sx={{ my: "1rem", gap: "1rem" }}
			>
				<Typography variant="h3" ref={headerRef} sx={{ fontSize: "2rem" }}>
					Tossup {currentQuestion + 1}: Editing
				</Typography>
				<EditSection
					cancel={() => setState(State.TOSSUP)}
					question={questions[currentQuestion]}
					save={(question: Question) => {
						updateCurrentQuestion({
							...question,
							comments: questions[currentQuestion].comments
						});
						setState(State.TOSSUP);
					}}
				/>
				<CommentSection
					comment={questions[currentQuestion].comments}
					setComment={(comments: string) => {
						updateCurrentQuestion({
							...questions[currentQuestion],
							comments
						});
					}}
				/>
			</Stack>
		);
	} else if (buzzer) {
		return (
			<Stack className="current-tossup buzzed" sx={{ my: "1rem" }}>
				<Typography variant="h3" ref={headerRef} sx={{ fontSize: "2rem" }}>
					Tossup {currentQuestion + 1}: {buzzer} Buzzed
				</Typography>
				<Stack direction="row" sx={{ gap: "1rem", my: "2rem" }}>
					<Button
						variant="contained"
						className="btn-success"
						color="success"
						onClick={() => {
							setState(State.BONI);
							updateCurrentQuestion({
								...questions[currentQuestion],
								correctTeam:
									teams[
										LETTERS.indexOf(
											buzzer.substring(0, 1) as "A" | "B" | "C" | "D"
										)
									].name
							});
						}}
					>
						Correct
					</Button>
					<Button
						variant="contained"
						className="btn-failure"
						color="error"
						onClick={() => setBuzzer(undefined)}
					>
						Incorrect
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							updateCurrentQuestion({
								...questions[currentQuestion],
								buzzes: questions[currentQuestion].buzzes.slice(
									0,
									questions[currentQuestion].buzzes.length - 1
								)
							});
							setBuzzer(undefined);
						}}
					>
						Cancel
					</Button>
				</Stack>
				<CommentSection
					comment={questions[currentQuestion].comments}
					setComment={(comments: string) => {
						updateCurrentQuestion({
							...questions[currentQuestion],
							comments
						});
					}}
				/>
			</Stack>
		);
	} else {
		return (
			<>
				<Stack className="current-tossup-header" sx={{ mt: "1rem" }}>
					<Stack>
						<Typography variant="h3" ref={headerRef} sx={{ fontSize: "2rem" }}>
							Tossup {currentQuestion + 1}
						</Typography>
						<Typography variant="body1" sx={{ my: "1rem" }}>
							Who Buzzed?
						</Typography>
					</Stack>
					<NavigationPanel
						currentQuestion={currentQuestion}
						nextQuestion={() => {
							setCurrentQuestion(currentQuestion + 1);
							setState(State.TOSSUP);
						}}
						previousQuestion={() => {
							setCurrentQuestion(currentQuestion - 1);
							setState(State.TOSSUP);
						}}
						setEditing={() => setState(State.EDITING)}
					/>
				</Stack>
				<Stack className="current-tossup" sx={{ mt: "1rem" }}>
					{teams.map((team, teamIdx) => (
						<Stack
							key={
								team.name === NOT_A_TEAM.name
									? `${team.name}${teamIdx}`
									: team.name
							}
							className="buzzer-section"
							direction="row"
							sx={{ gap: "1rem", my: "1rem" }}
						>
							{team.players.map((player, playerIdx) => (
								<Button
									key={playerIdx}
									variant={teamIdx === 3 ? "outlined" : "contained"}
									color={getTeamColor(teamIdx)}
									size="large"
									className="buzzer-button"
									disabled={questions[currentQuestion].buzzes.some(
										b => b.team === teams[teamIdx].name
									)}
									onClick={() => {
										setBuzzer(`${LETTERS[teamIdx]}${playerIdx + 1}`);
										updateCurrentQuestion({
											...questions[currentQuestion],
											buzzes: [
												...questions[currentQuestion].buzzes,
												{
													team: teams[teamIdx].name,
													player: playerIdx
												}
											]
										});
									}}
									sx={{ px: "3rem", py: "1rem" }}
								>
									{LETTERS[teamIdx]}
									{playerIdx + 1}
								</Button>
							))}
						</Stack>
					))}
					<CommentSection
						comment={questions[currentQuestion].comments}
						setComment={(comments: string) => {
							updateCurrentQuestion({
								...questions[currentQuestion],
								comments
							});
						}}
					/>
				</Stack>
			</>
		);
	}
};

export default CurrentQuestion;
