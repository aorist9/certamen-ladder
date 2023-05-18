import { ladderTypes } from "../constants";
import LadderType from "../types/LadderType";
import DataDisplay from "./DataDisplay";

const calculateTeams = (ladder: LadderType): string => {
	if (!ladder.teams) {
		return "None Yet";
	}

	if (Array.isArray(ladder.teams)) {
		return (
			"" +
			ladder.teams.reduce(
				(acc, division) => acc + Object.keys(division).length,
				0
			)
		);
	} else {
		return "" + Object.keys(ladder.teams).length;
	}
};

const calculateRoundsPlayed = (ladder: LadderType): string => {
	if (ladder.matches) {
		return (
			"" +
			ladder.matches.reduce((acc, round) => {
				if (round.find(room => room.find(team => team.score !== undefined))) {
					return acc + 1;
				} else {
					return acc;
				}
			}, 0)
		);
	} else {
		return "None that I can tell";
	}
};

const LadderInfoSection = ({ ladder }: { ladder: LadderType }) => (
	<section className="ladder-info-section">
		<DataDisplay description="Name" value={ladder.name} />
		<DataDisplay description="Type" value={ladderTypes[ladder.type]} />
		{ladder.divisions ? (
			<DataDisplay description="Divisions" value={"" + ladder.divisions} />
		) : (
			""
		)}
		<DataDisplay description="Teams" value={"" + calculateTeams(ladder)} />
		<DataDisplay description="Total Rounds" value={"" + ladder.rounds} />
		<DataDisplay
			description="Rounds Played"
			value={calculateRoundsPlayed(ladder)}
		/>
	</section>
);

export default LadderInfoSection;
