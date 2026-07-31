import React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useRoundContext } from "../../contexts/RoundContext";
import { useTheme } from "@mui/material/styles";

const ScoreSheetHeader: React.FC<{
	ladderId?: string | null;
	publicId?: string | null;
}> = ({ ladderId, publicId }) => {
	const { isEditMode, ladderName, roomName, roundNumber, setIsEditMode } =
		useRoundContext();
	const theme = useTheme();

	return (
		<Stack
			component="header"
			className="score-sheet-header"
			direction={{ xs: "column", sm: "row" }}
			sx={{
				[theme.breakpoints.down("sm")]: {
					alignItems: "flex-start"
				},
				[theme.breakpoints.up("sm")]: {
					justifyContent: "space-between",
					alignItems: "center"
				}
			}}
		>
			<Box component="section">
				<Typography variant="h2" sx={{ fontSize: "1.5rem" }}>
					Code Sheet
				</Typography>
				{ladderName && (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ fontWeight: 600 }}
					>
						{ladderName}
					</Typography>
				)}
				{roomName && <Typography variant="body2">Room: {roomName}</Typography>}
				{roundNumber !== undefined && (
					<Typography variant="body2">Round: {roundNumber}</Typography>
				)}
			</Box>
			<FormControlLabel
				className="hide-print"
				control={
					<Checkbox
						checked={isEditMode}
						name="edit-mode"
						id="edit-mode"
						onClick={() => setIsEditMode(!isEditMode)}
					/>
				}
				label="Edit Mode"
			/>
			<MuiLink
				className="hide-print"
				component={Link}
				to={`/ladder?${
					ladderId ? `ladder=${ladderId}` : `publicId=${publicId}`
				}`}
				underline="hover"
			>
				Return to Ladder
			</MuiLink>
		</Stack>
	);
};

export default ScoreSheetHeader;
