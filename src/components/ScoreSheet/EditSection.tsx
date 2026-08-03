import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { LETTERS, Question } from "../../types/Round";
import EditBuzz from "./EditBuzz";
import { useRoundContext } from "../../contexts/RoundContext";

const EditSection = ({
	cancel,
	question,
	save
}: {
	cancel: VoidFunction;
	question: Question;
	save: (question: Question) => void;
}) => {
	const { teams } = useRoundContext();

	const [buzz1, setBuzz1] = useState<string | undefined>(
		question.buzzes.length
			? `${
					LETTERS[
						teams.findIndex(team => team.name === question.buzzes[0].team)
					]
				}${question.buzzes[0].player + 1}`
			: undefined
	);
	const [buzz2, setBuzz2] = useState<string | undefined>(
		question.buzzes.length > 1
			? `${
					LETTERS[
						teams.findIndex(team => team.name === question.buzzes[1].team)
					]
				}${question.buzzes[1].player + 1}`
			: undefined
	);
	const [buzz3, setBuzz3] = useState<string | undefined>(
		question.buzzes.length > 2
			? `${
					LETTERS[
						teams.findIndex(team => team.name === question.buzzes[2].team)
					]
				}${question.buzzes[2].player + 1}`
			: undefined
	);
	const [correct, setCorrect] = useState<number | undefined>(
		question.buzzes.findIndex(team => team.team === question.correctTeam)
	);
	const [bonus1, setBonus1] = useState(
		question.boni.length ? question.boni[0] : false
	);
	const [bonus2, setBonus2] = useState(
		question.boni.length > 1 ? question.boni[1] : false
	);

	const mapBuzzer = (
		buzzer: string | undefined
	): { team: string; player: number } | undefined => {
		if (!buzzer || buzzer.length !== 2) {
			return undefined;
		}

		return {
			team: teams[LETTERS.indexOf(buzzer.charAt(0) as "A" | "B" | "C" | "D")]
				.name,
			player: parseInt(buzzer.charAt(1)) - 1
		};
	};

	return (
		<Stack
			direction="column"
			style={{
				gap: "1em",
				paddingBottom: "1em"
			}}
		>
			<EditBuzz
				clearCorrect={() => setCorrect(undefined)}
				isCorrect={correct === 0}
				label={"Buzz 1"}
				setCorrect={() => setCorrect(0)}
				setValue={(value: string | undefined) => {
					setBuzz1(value);
				}}
				value={buzz1}
				values={LETTERS.slice(0, 3)
					.map(letter => [1, 2, 3, 4].map(number => `${letter}${number}`))
					.flat()}
			/>
			<EditBuzz
				clearCorrect={() => setCorrect(undefined)}
				isCorrect={correct === 1}
				label={"Buzz 2"}
				setCorrect={() => setCorrect(1)}
				setValue={(value: string | undefined) => {
					setBuzz2(value);
				}}
				value={buzz2}
				values={LETTERS.slice(0, 3)
					.filter(letter => letter !== buzz1?.charAt(0))
					.map(letter => [1, 2, 3, 4].map(number => `${letter}${number}`))
					.flat()}
			/>
			<EditBuzz
				clearCorrect={() => setCorrect(undefined)}
				isCorrect={correct === 2}
				label={"Buzz 3"}
				setCorrect={() => setCorrect(2)}
				setValue={(value: string | undefined) => {
					setBuzz3(value);
				}}
				value={buzz3}
				values={LETTERS.slice(0, 3)
					.filter(
						letter => letter !== buzz1?.charAt(0) && letter !== buzz2?.charAt(0)
					)
					.map(letter => [1, 2, 3, 4].map(number => `${letter}${number}`))
					.flat()}
			/>
			<Stack direction="column" className="bonus-checkbox-section">
				<FormControlLabel
					control={
						<Checkbox
							checked={bonus1}
							onChange={() => setBonus1(!bonus1)}
							name="bonus1"
						/>
					}
					label="Bonus 1"
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={bonus2}
							onChange={() => setBonus2(!bonus2)}
							name="bonus2"
						/>
					}
					label="Bonus 2"
				/>
			</Stack>
			<Box>
				<Button
					className="btn-success"
					variant="contained"
					color="success"
					onClick={() => {
						const buzzes = [
							mapBuzzer(buzz1),
							mapBuzzer(buzz2),
							mapBuzzer(buzz3)
						].filter(buzz => !!buzz) as { team: string; player: number }[];
						save({
							buzzes,
							correctTeam:
								correct === undefined ? undefined : buzzes[correct].team,
							boni: [bonus1, bonus2]
						});
					}}
				>
					Save
				</Button>
				<Button
					className="btn-failure"
					onClick={cancel}
					variant="contained"
					color="error"
				>
					Cancel
				</Button>
			</Box>
		</Stack>
	);
};

export default EditSection;
