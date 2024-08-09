import React, { useEffect, useRef, useState } from "react";
import { LETTERS, Question } from "../../types/Round";
import { useRoundContext } from "../../contexts/RoundContext";
import BonusCheckboxSection from "./BonusCheckboxSection";
import CommentSection from "./CommentSection";
import NavigationPanel from "./NavigationPanel";
import EditSection from "./EditSection";
import TimerSection from "./TimerSection";

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

	if (state === State.BONI) {
		return (
			<section className="current-tossup boni">
				<h3 ref={headerRef}>
					Tossup {currentQuestion + 1}: Boni to{" "}
					{questions[currentQuestion].correctTeam}
				</h3>
				<section
					style={{
						display: "flex",
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
				</section>
				<CommentSection
					comment={questions[currentQuestion].comments}
					setComment={(comments: string) => {
						updateCurrentQuestion({
							...questions[currentQuestion],
							comments
						});
					}}
				/>
			</section>
		);
	} else if (state === State.EDITING) {
		return (
			<section className="current-tossup editing">
				<h3 ref={headerRef}>Tossup {currentQuestion + 1}: Editing</h3>
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
			</section>
		);
	} else if (buzzer) {
		return (
			<section className="current-tossup buzzed">
				<h3 ref={headerRef}>
					Tossup {currentQuestion + 1}: {buzzer} Buzzed
				</h3>
				<button
					className="btn-success"
					style={{ backgroundColor: "darkgreen" }}
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
				</button>
				<button
					className="btn-failure"
					style={{ backgroundColor: "darkred" }}
					onClick={() => setBuzzer(undefined)}
				>
					Incorrect
				</button>
				<button
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
				</button>
				<CommentSection
					comment={questions[currentQuestion].comments}
					setComment={(comments: string) => {
						updateCurrentQuestion({
							...questions[currentQuestion],
							comments
						});
					}}
				/>
			</section>
		);
	} else {
		return (
			<>
				<section className="current-tossup-header">
					<section>
						<h3 ref={headerRef}>Tossup {currentQuestion + 1}</h3>
						<p>Who Buzzed?</p>
					</section>
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
				</section>
				<section className="current-tossup">
					{teams.map((team, teamIdx) => (
						<section key={team.name} className="buzzer-section">
							{team.players.map((player, playerIdx) => (
								<button
									key={playerIdx}
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
								>
									{LETTERS[teamIdx]}
									{playerIdx + 1}
								</button>
							))}
						</section>
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
				</section>
			</>
		);
	}
};

export default CurrentQuestion;
