import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../services/ladderService";

const RoomLinkCell = ({
	ladderId,
	publicLadderId,
	divisionIdx,
	roomIdx,
	scoreSheetIds
}: {
	ladderId?: string;
	publicLadderId?: string;
	divisionIdx: number;
	roomIdx: number;
	scoreSheetIds: string[];
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [email, setEmail] = useState("");

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsError(false);
		setIsLoading(true);
		try {
			const response = await window.fetch(
				`${BACKEND_URL}/api/certamen/score-keepers.php`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email,
						ladderId,
						roomLink: `${process.env.NODE_ENV === "production" ? "https://aorist9.github.io/certamen-ladder" : "http://localhost:3030"}/#/ladder-row?publicLadderId=${publicLadderId}&division=${divisionIdx}&room=${roomIdx}`,
						scoreSheets: scoreSheetIds.map((id, idx) => ({
							id,
							round: `Round ${idx + 1}`
						}))
					})
				}
			);

			if (response.status === 204) {
				setEmail("");
			} else {
				setIsError(true);
			}
		} catch (error) {
			console.error(error);
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<td className="hide-print">
			<Stack spacing={1.5} sx={{ minWidth: 280 }}>
				<MuiLink
					component={Link}
					to={`/ladder-row?${ladderId ? `ladder=${ladderId}` : `publicId=${publicLadderId}`}&division=${divisionIdx}&room=${roomIdx}`}
					underline="hover"
				>
					Page with just this room's rounds
				</MuiLink>
				{ladderId &&
					(isLoading ? (
						<Typography variant="body2">Loading...</Typography>
					) : (
						<Box component="form" onSubmit={onSubmit}>
							<Stack spacing={1}>
								<TextField
									size="small"
									label="Scorekeeper's Email"
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
								<Button
									variant="contained"
									disabled={email === ""}
									type="submit"
								>
									Email Scoresheets and passwords
								</Button>
								{isError && (
									<Alert severity="error">
										Error sending email. Please try again.
									</Alert>
								)}
							</Stack>
						</Box>
					))}
			</Stack>
		</td>
	);
};

export default RoomLinkCell;
