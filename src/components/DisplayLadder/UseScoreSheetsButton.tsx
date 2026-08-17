import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const UseScoreSheetsButton = ({
	isLadderPublished,
	onNo = () => {},
	onYes
}: {
	isLadderPublished: boolean;
	onNo?: VoidFunction;
	onYes: VoidFunction;
}) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				className="hide-print"
				sx={{ ml: "1em" }}
				onClick={() => {
					setOpen(true);
				}}
			>
				Use Score Sheets
			</Button>
			<Dialog open={open}>
				<DialogContent>
					<Typography component="p" variant="body2">
						Are you sure you want to create scoresheets? You will not be able to
						add or remove teams from the ladder once you create scoresheets, and
						any scores you have already entered will be wiped out, though you'll
						be able to re-enter them.
					</Typography>
					{!isLadderPublished && (
						<Typography component="p" variant="body2">
							This will also cause the ladder to be published.
						</Typography>
					)}
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

export default UseScoreSheetsButton;
