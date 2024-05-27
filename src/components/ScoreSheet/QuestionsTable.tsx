import React from "react";
import { LETTERS } from "../../types/Round";
import { useRoundContext } from "../../contexts/RoundContext";

const CHECK = "\u2713";
const X = "X";

const NEUTRAL_CELL = <td></td>;
const SUCCESS_CELL = (
	<td>
		<span className="success">{CHECK}</span>
	</td>
);
const FAILURE_CELL = (
	<td>
		<span className="failure">{X}</span>
	</td>
);

const renderQuestionCell = (
	successCondition: boolean,
	failureCondition: boolean
) => {
	if (successCondition) {
		return SUCCESS_CELL;
	} else if (failureCondition) {
		return FAILURE_CELL;
	} else {
		return NEUTRAL_CELL;
	}
};

const QuestionsTable = ({ currentQuestion }: { currentQuestion: number }) => {
	const { questions, teams } = useRoundContext();
	return (
		<table className="questions-table">
			<thead>
				<tr>
					<th>#</th>
					<th style={{ width: "40%" }}>Player</th>
					<th>TU (10)</th>
					<th>B1 (5)</th>
					<th>B2 (5)</th>
					<th>Comments</th>
				</tr>
			</thead>
			<tbody>
				{questions.map((question, idx) => (
					<tr key={idx}>
						<td>{idx + 1}</td>
						<td>
							{question.buzzes.map(buzz => (
								<span
									key={buzz.team}
									className={
										question.correctTeam === buzz.team
											? "buzzer correct"
											: question.correctTeam || currentQuestion > idx
											? "buzzer incorrect"
											: "buzzer"
									}
								>
									{LETTERS[teams.map(team => team.name).indexOf(buzz.team)]}
									{buzz.player + 1}
								</span>
							))}
						</td>
						{renderQuestionCell(!!question.correctTeam, currentQuestion > idx)}
						{renderQuestionCell(
							!!question.boni?.length && question.boni[0],
							!!question.boni?.length
						)}
						{renderQuestionCell(
							question.boni?.length > 1 && question.boni[1],
							question.boni?.length > 1
						)}
						<td>{question.comments}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default QuestionsTable;
