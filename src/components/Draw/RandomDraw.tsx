import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { DrawProps } from "../../routes/Draw";
import { letters } from "../../constants";

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
	const [teams, setTeams] = useState<string>(
		props.teams ? Object.values(props.teams).join("\n") : ""
	);
	const splitTeams = useMemo<string[]>(
		() => teams.split(/\s*[,\n]\s*/),
		[teams]
	);
	useEffect(() => {
		props.setDrawFunction(() => {
			let availableLetters = letters.slice(0, splitTeams.length);
			return mapTeamsToObject(splitTeams, availableLetters);
		});
		// eslint-disable-next-line
	}, [splitTeams]);

	return (
		<section className="draw-body">
			Please enter team names in the text box. You can separate them with commas
			or new lines.
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
				{Object.keys(splitTeams).length === 6 && (
					<p>
						<label>
							<input
								type="checkbox"
								id="three-rooms-for-six-teams"
								checked={props.threeRooms}
								onChange={e => props.setThreeRooms(e.target.checked)}
							/>
							Separate these six teams into 3 rooms?
						</label>
					</p>
				)}
			</section>
		</section>
	);
};

export default RandomDraw;
