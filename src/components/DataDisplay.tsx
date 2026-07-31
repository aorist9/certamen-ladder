import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const DataDisplay = (props: { description: string; value: string }) => (
	<Paper
		variant="outlined"
		sx={{
			p: 1.5,
			bgcolor: "background.paper",
			borderColor: "divider"
		}}
	>
		<Stack spacing={0.5}>
			<Typography
				variant="overline"
				sx={{
					textTransform: "uppercase",
					letterSpacing: 1.2,
					color: "text.secondary"
				}}
			>
				{props.description}
			</Typography>
			<Typography variant="body1" color="text.primary">
				{props.value}
			</Typography>
		</Stack>
	</Paper>
);

export default DataDisplay;
