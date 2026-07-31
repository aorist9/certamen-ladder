import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { LETTERS } from "../../types/Round";
import { useRoundContext } from "../../contexts/RoundContext";

const CHECK = "\u2713";
const X = "X";

const NEUTRAL_CELL = <TableCell></TableCell>;
const SUCCESS_CELL = (
	<TableCell color="success">
		<Typography variant="body1" color="success" sx={{ fontWeight: 600 }}>
			{CHECK}
		</Typography>
	</TableCell>
);
const FAILURE_CELL = (
	<TableCell>
		<Typography variant="body1" color="error" sx={{ fontWeight: 600 }}>
			{X}
		</Typography>
	</TableCell>
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

const QuestionsTable = ({
	currentQuestion,
	setCurrentQuestion
}: {
	currentQuestion: number;
	setCurrentQuestion: (number: number) => void;
}) => {
	const { questions, teams } = useRoundContext();
	return (
		<Table className="questions-table">
			<TableHead>
				<TableRow>
					<TableCell>#</TableCell>
					<TableCell sx={{ minWidth: "40%" }}>Player</TableCell>
					<TableCell>TU (10)</TableCell>
					<TableCell>B1 (5)</TableCell>
					<TableCell>B2 (5)</TableCell>
					<TableCell>Comments</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{questions.map((question, idx) => (
					<TableRow key={idx}>
						<TableCell sx={{ textAlign: "center" }}>
							{currentQuestion === idx ? (
								idx + 1
							) : (
								<>
									<Button
										className="link-button hide-print"
										onClick={() => setCurrentQuestion(idx)}
									>
										{idx + 1}
									</Button>
									<Typography className="print-only" variant="body2">
										{idx + 1}
									</Typography>
								</>
							)}
						</TableCell>
						<TableCell>
							<Stack
								direction="row"
								sx={{
									height: "100%",
									gap: "1rem",
									alignItems: "center"
								}}
							>
								{question.buzzes.map(buzz => (
									<Typography
										variant="body1"
										key={buzz.team}
										color={
											question.correctTeam === buzz.team
												? "success"
												: question.correctTeam || currentQuestion > idx
													? "error"
													: ""
										}
										sx={{
											fontWeight: 600,
											textDecoration:
												question.correctTeam &&
												currentQuestion >= idx &&
												question.correctTeam !== buzz.team
													? "line-through"
													: ""
										}}
									>
										{LETTERS[teams.map(team => team.name).indexOf(buzz.team)]}
										{buzz.player + 1}
									</Typography>
								))}
							</Stack>
						</TableCell>
						{renderQuestionCell(!!question.correctTeam, currentQuestion > idx)}
						{renderQuestionCell(
							!!question.boni?.length && question.boni[0],
							!!question.boni?.length
						)}
						{renderQuestionCell(
							question.boni?.length > 1 && question.boni[1],
							question.boni?.length > 1
						)}
						<TableCell>{question.comments}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default QuestionsTable;
