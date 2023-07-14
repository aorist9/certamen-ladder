import React, { ChangeEvent, useState } from "react";
import Matches from "../../types/Matches";
import { EditingStatus } from "./DisplayedLadder";
import addSwissPoints from "./addSwissPoints";
import DraggableRoomDisplay from "./DraggableRoomDisplay";

const determineAddScoresButtonText = (status: EditingStatus) => {
	switch (status) {
		case EditingStatus.NEW:
			return "Set Scores";
		case EditingStatus.EDITING:
			return "Save Scores";
		case EditingStatus.EDITED:
			return "Edit Scores";
	}
};

type LadderTableProps = {
	hideIfPublic: (
		elem: string | JSX.Element | JSX.Element[]
	) => string | JSX.Element | JSX.Element[];
	isSwiss: boolean;
	pittings: Matches;
	roomEditStatus: EditingStatus;
	rooms: string[];
	roundScoreEditStatuses: EditingStatus[];
	setPittings: (pittings: Matches) => void;
	setRooms: (rooms: string[]) => void;
	setRoundScoreEditStatuses: (roundScoreEditStatuses: EditingStatus[]) => void;
	updateMatches: (matches: Matches) => void;
};

const LadderTable = (props: LadderTableProps) => {
	const [draggedRound, setDraggedRound] = useState<number | undefined>();

	const onScoreChange =
		(i: number, j: number, k: number) => (e: ChangeEvent<HTMLInputElement>) => {
			const newPitting: {
				team: string;
				score?: number;
			}[] = [...props.pittings[j][i]];
			newPitting[k].score = parseInt(e.target.value);
			for (let idx = 0; idx < newPitting.length; idx++) {
				if (!newPitting[idx].score) {
					newPitting[idx].score = 0;
				}
			}

			const newPittings = [
				...props.pittings.slice(0, j),
				[
					...props.pittings[j].slice(0, i),
					newPitting,
					...props.pittings[j].slice(i + 1)
				],
				...props.pittings.slice(j + 1)
			];
			props.updateMatches(newPittings);
			props.setPittings(newPittings);
		};

	return (
		<table>
			<thead>
				<tr>
					{props.pittings.map((_, i: number) => (
						<th key={i} style={{ padding: "0 10px" }}>
							Round {i + 1}
							{props.hideIfPublic(
								<button
									style={{ marginLeft: "1.5em" }}
									onClick={() => {
										if (
											props.roundScoreEditStatuses[i] ===
												EditingStatus.EDITING &&
											props.isSwiss
										) {
											let newPittings = [
												...props.pittings.slice(0, i),
												props.pittings[i].map(addSwissPoints),
												...props.pittings.slice(i + 1)
											];

											props.updateMatches(newPittings);
											props.setPittings(newPittings);
										}

										props.setRoundScoreEditStatuses([
											...props.roundScoreEditStatuses.slice(0, i),
											props.roundScoreEditStatuses[i] === EditingStatus.EDITING
												? EditingStatus.EDITED
												: EditingStatus.EDITING,
											...props.roundScoreEditStatuses.slice(i + 1)
										]);
									}}
								>
									{determineAddScoresButtonText(
										props.roundScoreEditStatuses[i]
									)}
								</button>
							)}
						</th>
					))}
					{props.roomEditStatus === EditingStatus.NEW ? "" : <th>Room</th>}
				</tr>
			</thead>
			<tbody>
				{props.pittings[0].map((_, i: number) => (
					<tr key={i}>
						{props.pittings.map((_, j: number) => (
							<DraggableRoomDisplay
								key={`${j}:${i}`}
								editStatus={props.roundScoreEditStatuses[j]}
								isDraggedRound={draggedRound === j}
								moveRoom={(sourceIdx: number) => {
									if (sourceIdx === i) {
										return;
									}

									const newPittings: Matches = [...props.pittings];
									let newRound;
									if (sourceIdx < i) {
										newRound = [
											...props.pittings[j].slice(0, sourceIdx),
											...props.pittings[j].slice(sourceIdx + 1, i + 1),
											props.pittings[j][sourceIdx],
											...props.pittings[j].slice(i + 1)
										];
									} else {
										newRound = [
											...props.pittings[j].slice(0, i),
											props.pittings[j][sourceIdx],
											...props.pittings[j].slice(i, sourceIdx),
											...props.pittings[j].slice(sourceIdx + 1)
										];
									}
									newPittings[j] = newRound;
									props.setPittings(newPittings);
									props.updateMatches(newPittings);
								}}
								onScoreChange={onScoreChange}
								pitting={props.pittings[j][i]}
								roomNumber={i}
								roundNumber={j}
								startDrag={() => setDraggedRound(j)}
							/>
						))}
						{props.roomEditStatus === EditingStatus.NEW ? (
							""
						) : (
							<td className="room-cell" data-testid="room">
								{props.roomEditStatus === EditingStatus.EDITING ? (
									<textarea
										data-testid="room-input"
										value={props.rooms[i]}
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
											props.setRooms([
												...props.rooms.slice(0, i),
												e.target.value,
												...props.rooms.slice(i + 1)
											])
										}
									/>
								) : (
									props.rooms[i]
								)}
							</td>
						)}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default LadderTable;
