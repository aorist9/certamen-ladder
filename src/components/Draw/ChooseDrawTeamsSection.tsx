import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import DrawListItem from "./DrawListItem";

type Props = {
	teams: { [letter: string]: string };
	removeTeam: (letter: string) => void;
};

const ChooseDrawTeamsSection = (props: Props) => (
	<Box component="section" sx={{ width: "100%" }}>
		<Typography variant="subtitle2" sx={{ mb: 1 }}>
			Entered Teams
		</Typography>
		<List dense sx={{ p: 0 }}>
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
		</List>
	</Box>
);

export default ChooseDrawTeamsSection;
