import React, { useState, DragEvent, ChangeEvent, useEffect } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TeamDisplay from "./TeamDisplay";
import { EditingStatus } from "./DisplayedLadder";
import { Link, useSearchParams } from "react-router-dom";
import { RoomV2 } from "../../types/Matches";
import scoreSheetService from "../../services/scoreSheetService";
import { useFeatureFlags } from "../../contexts/featureFlagsContext";
import OverrideScoreSheetButton from "./OverrideScoreSheetButton";

type RoomDisplayProps = {
	editStatus: EditingStatus;
	hideIfPublic: (
		elem: string | JSX.Element | JSX.Element[]
	) => string | JSX.Element | JSX.Element[];
	isAnyRoundEditingScore: boolean;
	isDraggedRound: boolean;
	moveRoom: (sourceIdx: number) => void;
	onScoreChange: (
		i: number,
		j: number,
		k: number
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	overrideScoresheet: () => void;
	pitting: RoomV2;
	roomNumber: number;
	roundNumber: number;
	startDrag: () => void;
};

const DraggableRoomDisplay = ({
	editStatus,
	hideIfPublic,
	isAnyRoundEditingScore,
	isDraggedRound,
	moveRoom,
	onScoreChange,
	overrideScoresheet,
	pitting,
	roomNumber,
	roundNumber,
	startDrag
}: RoomDisplayProps) => {
	const { codeSheet: codeSheetFlag } = useFeatureFlags();
	const [isDragHovered, setIsDragHovered] = useState<boolean>(false);
	const [query] = useSearchParams();
	const canEdit = !query.get("publicId");
	const [password, setPassword] = useState<string | undefined>();

	const { scoresheetId, scoresheetOverridden } = pitting;
	useEffect(() => {
		let timer: NodeJS.Timeout;
		const checkForPassword = () => {
			if (scoresheetId && canEdit && !password) {
				const scoreSheet = scoreSheetService.getScoreSheet(scoresheetId);
				const password = scoreSheet?.password;
				if (password) {
					setPassword(password);
				} else {
					timer = setTimeout(checkForPassword, 2000);
				}
			}
		};
		checkForPassword();
		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [canEdit, scoresheetId, password]);

	return (
		<td
			key={`${roundNumber}:${roomNumber}`}
			data-testid={`round-${roundNumber + 1}`}
			onDragOver={(e: DragEvent<HTMLTableCellElement>) => {
				if (isDraggedRound) {
					e.preventDefault();
					setIsDragHovered(true);
				}
			}}
			onDragEnd={canEdit ? () => setIsDragHovered(false) : () => {}}
			onDragExit={canEdit ? () => setIsDragHovered(false) : () => {}}
			onDragLeave={canEdit ? () => setIsDragHovered(false) : () => {}}
			onDrop={(e: DragEvent<HTMLTableCellElement>) => {
				if (canEdit) {
					setIsDragHovered(false);
					moveRoom(parseInt(e.dataTransfer.getData("roomIdx")));
				}
			}}
			style={
				isDragHovered
					? { border: "1.5px solid", borderColor: "primary.main" }
					: {}
			}
		>
			<Paper
				variant="outlined"
				sx={{
					p: 1.25,
					bgcolor: "background.paper",
					borderColor: isDragHovered ? "primary.main" : "divider"
				}}
			>
				<Box
					draggable={canEdit}
					onDragStart={(e: DragEvent) => {
						if (canEdit) {
							e.dataTransfer.setData("roomIdx", `${roomNumber}`);
							startDrag();
						}
					}}
					sx={{ cursor: canEdit ? "grab" : "default" }}
				>
					{pitting?.teams.map(({ team, score, swissPoints }, idx) => (
						<TeamDisplay
							key={team}
							onScoreChange={onScoreChange(roomNumber, roundNumber, idx)}
							roundEditStatus={editStatus}
							score={score}
							swissPoints={swissPoints}
							team={team}
						/>
					))}
				</Box>
				{scoresheetId && codeSheetFlag ? (
					<Stack spacing={1} sx={{ mt: 1.25 }} className="hide-print">
						<MuiLink
							component={Link}
							to={`/score-sheet?ladder=${query.get("ladder")}&round=${scoresheetId}`}
							underline="hover"
						>
							Score Sheet
						</MuiLink>
						{scoresheetOverridden ? (
							<Chip label="Overridden" size="small" color="warning" />
						) : (
							<OverrideScoreSheetButton onYes={overrideScoresheet} />
						)}
					</Stack>
				) : (
					""
				)}
				{codeSheetFlag &&
					!scoresheetOverridden &&
					password &&
					hideIfPublic(
						<Typography
							variant="caption"
							color="text.secondary"
							className="hide-print"
							sx={{ display: "block", mt: 1 }}
						>
							Password: {password}
						</Typography>
					)}
			</Paper>
		</td>
	);
};

export default DraggableRoomDisplay;
