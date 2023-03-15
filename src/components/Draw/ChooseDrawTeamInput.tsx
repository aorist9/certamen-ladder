import React, { ChangeEvent, FormEvent, useState } from 'react';

const ChooseDrawTeamInput = (props: {
	addTeam: (teamName: string) => void;
}) => {
	const [teamName, setTeamName] = useState<string | undefined>();
	return (
		<form
			onSubmit={(e: FormEvent) => {
				e.preventDefault();
				if (teamName) {
					props.addTeam(teamName);
					setTeamName('');
				}
			}}
			style={{ display: 'flex', columnGap: '1em' }}
		>
			<section className="form-field">
				<label htmlFor="team-name">Team Name:</label>
				<input
					type="text"
					id="team-name"
					value={teamName || ''}
					style={{ minWidth: '30rem' }}
					placeholder="Enter Your Team's Name (make sure to include Purple/Gold, A/B, if necessary)"
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setTeamName(e.target.value)
					}
				/>
			</section>
			<button type="submit" disabled={!teamName?.trim()}>
				Save
			</button>
		</form>
	);
};

export default ChooseDrawTeamInput;
