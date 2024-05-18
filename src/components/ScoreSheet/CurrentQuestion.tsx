import React, { useState } from "react";
import { LETTERS, Question } from "../../types/Round";
import { useRoundContext } from "../../contexts/RoundContext";
import BonusCheckboxSection from "./BonusCheckboxSection";

const LEFT_ARROW = "\u2190";
const RIGHT_ARROW = "\u2192";

enum State {
	TOSSUP,
	BONI
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

	if (state === State.BONI) {
		return (
			<section className="current-tossup boni">
				<h3>
					Tossup {currentQuestion + 1}: Boni to{" "}
					{questions[currentQuestion].correctTeam}
				</h3>
				<section style={{ display: "flex" }}>
					<BonusCheckboxSection
						done={(boni: boolean[]) => {
							updateCurrentQuestion({
								...questions[currentQuestion],
								boni
							});
							setState(State.TOSSUP);
							setCurrentQuestion(currentQuestion + 1);
							setBuzzer(undefined);
						}}
					/>
					<section className="timer-section"></section>
				</section>
			</section>
		);
	} else if (buzzer) {
		return (
			<section className="current-tossup buzzed">
				<h3>
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
			</section>
		);
	} else {
		return (
			<section className="current-tossup">
				<section
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between"
					}}
				>
					<section>
						<h3>Tossup {currentQuestion + 1}</h3>
						<p>Who Buzzed?</p>
					</section>
					<section>
						<button
							className="btn-info question-nav-button"
							disabled={currentQuestion === 0}
							onClick={() => setCurrentQuestion(currentQuestion - 1)}
						>
							{LEFT_ARROW}
						</button>
						<button
							className="btn-info question-nav-button"
							disabled={currentQuestion >= 19}
							onClick={() => setCurrentQuestion(currentQuestion + 1)}
						>
							{RIGHT_ARROW}
						</button>
					</section>
				</section>
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
			</section>
		);
	}
};

export default CurrentQuestion;
