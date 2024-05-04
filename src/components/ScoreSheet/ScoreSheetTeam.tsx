import React from "react";

const UP_ARROW = "\u2191";
const DOWN_ARROW = "\u2193";

const DraggableTeam = ({
	addPlayers,
	letter,
	moveDown,
	moveUp,
	team
}: {
	addPlayers: VoidFunction;
	letter: "A" | "B" | "C" | "D";
	moveDown?: VoidFunction;
	moveUp?: VoidFunction;
	team: string;
}) => {
	return (
		<li className="team-select-item">
			<label htmlFor={`team-${letter}-select`}>Team {letter}</label>
			<section id={`team-${letter}-select`} className="team-assignment">
				{team}
				<section className="button-section">
					<button
						disabled={!moveUp}
						className="direction-button hide-print"
						onClick={moveUp}
					>
						{UP_ARROW}
					</button>
					<button
						disabled={!moveDown}
						className="direction-button hide-print"
						onClick={moveDown}
					>
						{DOWN_ARROW}
					</button>
				</section>
			</section>
			<button className="btn-info hide-print" onClick={addPlayers}>
				Add Players
			</button>
		</li>
	);
};

export default DraggableTeam;
