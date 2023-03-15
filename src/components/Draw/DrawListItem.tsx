import React from 'react';

const DrawListItem = (props: {
	letter: string;
	team: string;
	onClick: () => void;
}) => (
	<li key={props.letter} className="team-display">
		<div className="letter">{props.letter}</div>
		<div className="team">{props.team}</div>
		<button className="btn-negative" onClick={props.onClick}>
			Remove
		</button>
	</li>
);

export default DrawListItem;
