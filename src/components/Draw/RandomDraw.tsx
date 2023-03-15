import React, { ChangeEvent, FormEvent, useState } from 'react';
import { DrawProps } from '../../routes/Draw';
import { letters } from '../../constants';

const mapTeamsToObject = (
	splitTeams: string[],
	availableLetters: string[]
): { [letter: string]: string } => {
	return splitTeams.reduce(
		(acc: { [letter: string]: string }, team: string) => {
			const idx = Math.floor(Math.random() * availableLetters.length);
			const letter = availableLetters[idx];
			availableLetters.splice(idx, 1);
			acc[letter] = team;
			return acc;
		},
		{}
	);
};

const RandomDraw = (props: DrawProps) => {
	const [teams, setTeams] = useState<string>('');

	return (
		<section className="App-page draw">
			Please enter team names in the text box. You can separate them with
			commas or new lines.
			<form
				onSubmit={(e: FormEvent) => {
					e.preventDefault();
					let splitTeams = teams.split(/\s*[,\n]\s*/);
					let availableLetters = letters.slice(0, splitTeams.length);
					props.addTeams(
						mapTeamsToObject(splitTeams, availableLetters)
					);
				}}
			>
				<section className="teams">
					<textarea
						value={teams}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
							setTeams(e.target.value)
						}
						rows={8}
						cols={50}
						placeholder="Enter teams here"
					/>
					<section className="button-section">
						<button type="submit">Generate Ladder</button>
					</section>
				</section>
			</form>
		</section>
	);
};

export default RandomDraw;
