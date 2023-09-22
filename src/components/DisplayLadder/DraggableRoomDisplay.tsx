import React, { useState, DragEvent, ChangeEvent } from "react";
import TeamDisplay from "./TeamDisplay";
import { EditingStatus } from "./DisplayedLadder";

type RoomDisplayProps = {
	editStatus: EditingStatus;
	isDraggedRound: boolean;
	moveRoom: (sourceIdx: number) => void;
	onScoreChange: (
		i: number,
		j: number,
		k: number
	) => (e: ChangeEvent<HTMLInputElement>) => void;
	pitting: { team: string; score?: number; swissPoints?: number }[];
	roomNumber: number;
	roundNumber: number;
	startDrag: () => void;
};

const DraggableRoomDisplay = ({
	editStatus,
	isDraggedRound,
	moveRoom,
	onScoreChange,
	pitting,
	roomNumber,
	roundNumber,
	startDrag
}: RoomDisplayProps) => {
	const [isDragHovered, setIsDragHovered] = useState<boolean>(false);

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
			onDragEnd={() => setIsDragHovered(false)}
			onDragExit={() => setIsDragHovered(false)}
			onDragLeave={() => setIsDragHovered(false)}
			onDrop={(e: DragEvent<HTMLTableCellElement>) => {
				setIsDragHovered(false);
				moveRoom(parseInt(e.dataTransfer.getData("roomIdx")));
			}}
			style={isDragHovered ? { border: "1.5px solid blue" } : {}}
		>
			<ul
				draggable={true}
				onDragStart={(e: DragEvent) => {
					e.dataTransfer.setData("roomIdx", `${roomNumber}`);
					startDrag();
				}}
			>
				{pitting?.map(({ team, score, swissPoints }, idx) => (
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
		</td>
	);
};

export default DraggableRoomDisplay;
