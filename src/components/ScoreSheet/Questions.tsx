import React, { useState } from "react";
import QuestionsTable from "./QuestionsTable";
import CurrentQuestion from "./CurrentQuestion";
import { useRoundContext } from "../../contexts/RoundContext";
import { Question } from "../../types/Round";

const Questions = () => {
	const { questions, isEditMode } = useRoundContext();
	const lastQuestionWithBuzzesIndex = questions.findLastIndex(
		(question: Question) => question.buzzes.length > 0
	);
	const [currentQuestion, setCurrentQuestion] = useState(
		(lastQuestionWithBuzzesIndex + 1) % questions.length
	);

	return (
		<section className="questions">
			{isEditMode && (
				<CurrentQuestion
					currentQuestion={currentQuestion}
					setCurrentQuestion={setCurrentQuestion}
				/>
			)}
			<QuestionsTable
				currentQuestion={currentQuestion}
				setCurrentQuestion={setCurrentQuestion}
			/>
		</section>
	);
};

export default Questions;
