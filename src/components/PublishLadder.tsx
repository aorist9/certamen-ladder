import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import { Ladder } from "../types/LadderType";
import QRCode from "react-qr-code";

const PublishLadder = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const [loading, setLoading] = useState<boolean>(false);
	const [ladder, setLadder] = useState<Ladder | undefined>(
		ladderId ? ladderService.getLadder(ladderId) : undefined
	);

	if (loading) {
		return (
			<Paper
				variant="outlined"
				sx={{ p: 3, bgcolor: "background.paper", borderColor: "divider" }}
			>
				<Stack spacing={1.5} sx={{ alignItems: "center" }}>
					<CircularProgress size={24} />
					<Typography variant="body1">Processing...</Typography>
				</Stack>
			</Paper>
		);
	} else if (ladder?.publicId) {
		const href = `${window.location.href.substring(
			0,
			window.location.href.indexOf("/certamen-ladder")
		)}/certamen-ladder#/ladder?publicId=${ladder.publicId}`;
		return (
			<Paper
				variant="outlined"
				sx={{ p: 3, bgcolor: "background.paper", borderColor: "divider" }}
			>
				<Stack spacing={2} sx={{ alignItems: "center" }}>
					<Alert severity="success" sx={{ width: "100%" }}>
						Your ladder is public.
					</Alert>
					<QRCode value={href} size={150} />
					<Link href={href} underline="hover">
						Public Link
					</Link>
				</Stack>
			</Paper>
		);
	} else if (ladder) {
		return (
			<Box sx={{ p: { xs: 1, md: 2 } }}>
				<Button
					variant="contained"
					onClick={() => {
						setLoading(true);
						const lddr: Ladder | undefined = ladderService.getLadder(ladder.id);
						if (!lddr) {
							throw new Error("umm... there's no ladder");
						} else if (lddr.publicId) {
							setLadder(lddr);
							setLoading(false);
							return;
						}

						ladderService
							.publishLadder(lddr)
							.then(() => {
								setLoading(false);
								window.location.reload();
							})
							.catch(() => {
								setLoading(false);
							});
					}}
				>
					Publish this Ladder
				</Button>
			</Box>
		);
	} else {
		return <></>;
	}
};

export default PublishLadder;
