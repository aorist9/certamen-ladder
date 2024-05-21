import { Ladder, LadderStatus } from "../types/LadderType";
import DataDisplay from "./DataDisplay";

const LadderInfoSection = (props: { ladder: Ladder }) => {
	const ladder: Ladder = new Ladder(props.ladder);
	const status: LadderStatus = ladder.calculateStatus();
	return (
		<section
			className={`ladder-info-section ladder-status-${status.replaceAll(
				" ",
				"-"
			)}`}
		>
			<strong>{ladder.name}</strong>
			<section className="ladder-additional-info-section">
				<DataDisplay description="Status" value={status} />
				<DataDisplay description="Type" value={ladder.ladderType} />
				{ladder.divisions ? (
					<DataDisplay
						description="Divisions"
						value={"" + ladder.divisions.length}
					/>
				) : (
					""
				)}
				<DataDisplay
					description="Teams"
					value={(ladder.calculateTeams() || "None Yet") + ""}
				/>
				<DataDisplay description="Total Rounds" value={"" + ladder.numRounds} />
				<DataDisplay
					description="Rounds Played"
					value={
						(ladder.calculateRoundsPlayed() || "None that I can tell") + ""
					}
				/>
			</section>
		</section>
	);
};

export default LadderInfoSection;
