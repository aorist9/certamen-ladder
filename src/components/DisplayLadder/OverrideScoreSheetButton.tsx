import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const OverrideScoreSheetButton = ({
	onNo = () => {},
	onYes
}: {
	onNo?: VoidFunction;
	onYes: VoidFunction;
}) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				className="hide-print"
				size="small"
				variant="outlined"
				onClick={() => {
					setOpen(true);
				}}
			>
				Override
			</Button>
			<Dialog open={open}>
				<DialogContent>
					<Typography component="p" variant="body2">
						Are you sure you want to override the scoresheet? This can't be
						undone, but you'll still be able to see the scoresheet
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => {
							onYes();
							setOpen(false);
						}}
					>
						Yes
					</Button>
					<Button
						variant="outlined"
						color="error"
						size="large"
						onClick={() => {
							onNo();
							setOpen(false);
						}}
					>
						No
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default OverrideScoreSheetButton;
