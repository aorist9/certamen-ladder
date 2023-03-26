import React from "react";
import DrawListItem from "./DrawListItem";

type Props = {
	teams: { [letter: string]: string };
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
	</section>
);

export default ChooseDrawTeamsSection;
