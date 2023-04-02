import React, { ChangeEvent } from "react";
import { EditingStatus } from "./DisplayedLadder";

type TeamDisplayProps = {
	onScoreChange: (e: ChangeEvent<HTMLInputElement>) => void;
	roundEditStatus: EditingStatus;
	score: number | undefined;
	team: string;
};

const TeamDisplay = (props: TeamDisplayProps) => {
	return (
		<li>
			{props.roundEditStatus === EditingStatus.EDITING ||
			props.score !== undefined ? (
				<section className="team-display">
					<span>{props.team}</span>
					<span style={{ marginLeft: "0.5em" }}>
						{props.roundEditStatus === EditingStatus.EDITING ? (
							<input
								type="number"
								step={5}
								value={props.score || 0}
								onChange={props.onScoreChange}
							/>
						) : (
							<strong>{props.score}</strong>
						)}
					</span>
				</section>
			) : (
				props.team
			)}
		</li>
	);
};

export default TeamDisplay;
