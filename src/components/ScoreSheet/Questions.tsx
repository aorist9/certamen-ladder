import React, { useState } from "react";
import QuestionsTable from "./QuestionsTable";
import CurrentQuestion from "./CurrentQuestion";

const Questions = () => {
	const [currentQuestion, setCurrentQuestion] = useState(0);

	return (
		<section className="questions">
			<CurrentQuestion
				currentQuestion={currentQuestion}
				setCurrentQuestion={setCurrentQuestion}
			/>
			<QuestionsTable currentQuestion={currentQuestion} />
		</section>
	);
};

export default Questions;
