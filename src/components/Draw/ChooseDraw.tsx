import React, { useEffect, useState } from 'react';
import NumberInput from '../NumberInput';
import { letters } from '../../constants';
import { DrawProps } from '../../routes/Draw';
import ChooseDrawTeamsSection from './ChooseDrawTeamsSection';
import ChooseDrawTeamInput from './ChooseDrawTeamInput';

const Draw = (props: DrawProps) => {
	const [numLetters, setNumLetters] = useState<number | undefined>(15);
	const [displayLetter, setDisplayLetter] = useState<string>('A');
	const [chosenLetter, setChosenLetter] = useState<string | undefined>();
	const [teams, setTeams] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		let lettersToChooseFrom: string[] = letters
			.slice(0, numLetters)
			.filter((letter: string) => !Object.keys(teams).includes(letter));

		const rotate = () => {
			timeout = setTimeout(() => {
				if (numLetters) {
					setDisplayLetter(
						lettersToChooseFrom[
							Math.floor(
								Math.random() * lettersToChooseFrom.length
							)
						]
					);
				} else {
					setDisplayLetter('A');
				}

				if (!chosenLetter) {
					rotate();
				}
			}, 50);
		};
		rotate();

		return () => clearTimeout(timeout);
	}, [chosenLetter, numLetters, teams]);

	return (
		<section className="App-page draw">
			<NumberInput
				id="number-of-letters"
				label="How many letters should players choose from (it's okay if not all letters are picked)?"
				setValue={value => setNumLetters(value)}
				value={numLetters}
			/>
			<section className="draw-section">
				<figure data-testid="letter-display" className="letter-display">
					{chosenLetter || displayLetter}
				</figure>
				{chosenLetter ? (
					<ChooseDrawTeamInput
						addTeam={(teamName: string) => {
							setTeams({
								...teams,
								[chosenLetter]: teamName
							});
							setChosenLetter(undefined);
						}}
					/>
				) : (
					<button
						className="draw-button"
						onClick={() => {
							setChosenLetter(displayLetter);
						}}
					>
						Draw
					</button>
				)}
			</section>
			{Object.keys(teams).length ? (
				<ChooseDrawTeamsSection
					teams={teams}
					addTeams={props.addTeams}
					removeTeam={(letter: string) => {
						let newTeams = { ...teams };
						delete newTeams[letter];
						setTeams(newTeams);
					}}
				/>
			) : (
				''
			)}
		</section>
	);
};

export default Draw;
