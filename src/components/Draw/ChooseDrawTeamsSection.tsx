import React from 'react';
import DrawListItem from './DrawListItem';

type Props = {
	teams: { [letter: string]: string };
	addTeams: (teams: { [letter: string]: string }) => void;
	removeTeam: (letter: string) => void;
};

const ChooseDrawTeamsSection = (props: Props) => (
	<section className="teams">
		<ul>
			{Object.keys(props.teams)
				.sort()
				.map((teamLetter: string) => (
					<DrawListItem
						key={teamLetter}
						letter={teamLetter}
						team={props.teams[teamLetter]}
						onClick={() => props.removeTeam(teamLetter)}
					/>
				))}
		</ul>
		<section className="button-section">
			<button onClick={() => props.addTeams(props.teams)}>
				Generate Ladder
			</button>
		</section>
	</section>
);

export default ChooseDrawTeamsSection;
