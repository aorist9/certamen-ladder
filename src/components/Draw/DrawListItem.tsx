import React from "react";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const DrawListItem = (props: {
	letter: string;
	team: string;
	onClick: () => void;
}) => (
	<ListItem disablePadding sx={{ py: 0.5 }}>
		<Stack
			direction="row"
			spacing={1.5}
			sx={{ width: "100%", alignItems: "center" }}
		>
			<Typography variant="body2" sx={{ minWidth: 24, fontWeight: 700 }}>
				{props.letter}
			</Typography>
			<Typography variant="body2" sx={{ flexGrow: 1 }}>
				{props.team}
			</Typography>
			<Button
				size="small"
				color="error"
				variant="outlined"
				onClick={props.onClick}
			>
				Remove
			</Button>
		</Stack>
	</ListItem>
);

export default DrawListItem;
