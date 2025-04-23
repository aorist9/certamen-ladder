import React, { useState, DragEvent, ChangeEvent } from "react";
import TeamDisplay from "./TeamDisplay";
import { EditingStatus } from "./DisplayedLadder";
import { Link, useSearchParams } from "react-router-dom";
import features from "../../features.json";
import { RoomV2 } from "../../types/Matches";

type RoomDisplayProps = {
	editStatus: EditingStatus;
	hideIfPublic: (
		elem: string | JSX.Element | JSX.Element[]
	) => string | JSX.Element | JSX.Element[];
	isAnyRoundEditingScore: boolean;
	isDraggedRound: boolean;
	lockPittings: VoidFunction;
	moveRoom: (sourceIdx: number) => void;
	onScoreChange: (
		i: number,
		j: number,
		k: number
	) => (e: ChangeEvent<HTMLInputElement>) => void;
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
	lockPittings,
	moveRoom,
	onScoreChange,
	pitting,
	roomNumber,
	roundNumber,
	startDrag
}: RoomDisplayProps) => {
	const [isDragHovered, setIsDragHovered] = useState<boolean>(false);
	const [query] = useSearchParams();
	const canEdit = !query.get("publicId");

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
			style={isDragHovered ? { border: "1.5px solid blue" } : {}}
		>
			<ul
				draggable={canEdit}
				onDragStart={(e: DragEvent) => {
					if (canEdit) {
						e.dataTransfer.setData("roomIdx", `${roomNumber}`);
						startDrag();
					}
				}}
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
			</ul>
			{pitting?.scoresheetId && features.codeSheet ? (
				<Link
					to={`/score-sheet?ladder=${query.get("ladder")}&round=${
						pitting.scoresheetId
					}`}
					tabIndex={isAnyRoundEditingScore ? 2 : undefined}
				>
					Score Sheet
				</Link>
			) : (
				""
			)}
		</td>
	);
};

export default DraggableRoomDisplay;
