import React from "react";
import { useRoundContext } from "../../contexts/RoundContext";

const UP_ARROW = "\u2191";
const DOWN_ARROW = "\u2193";

const TeamDisplay = ({
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
	const { isEditMode } = useRoundContext();

	return (
		<li className="team-select-item">
			<label htmlFor={`team-${letter}-select`}>Team {letter}</label>
			<section id={`team-${letter}-select`} className="team-assignment">
				{team}
				{isEditMode && (
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
				)}
			</section>
			{isEditMode && (
				<button className="btn-info hide-print" onClick={addPlayers}>
					Add Players
				</button>
			)}
		</li>
	);
};

export default TeamDisplay;
