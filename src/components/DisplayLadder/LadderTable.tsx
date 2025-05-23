import { ChangeEvent, useState } from "react";
import { MatchesV2 } from "../../types/Matches";
import { EditingStatus } from "./DisplayedLadder";
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
	isSwissByPoints: boolean;
	ladderId: string;
	matches?: MatchesV2;
	pittings: MatchesV2;
	publicLadderId?: string;
	roomEditStatus: EditingStatus;
	rooms: string[];
	roundScoreEditStatuses: EditingStatus[];
	setPittings: (pittings: MatchesV2) => void;
	setRooms: (rooms: string[]) => void;
	setRoundScoreEditStatuses: (roundScoreEditStatuses: EditingStatus[]) => void;
	updateMatches: (matches: MatchesV2) => void;
};

const updatePittingScores = (
	pittings: any,
	i: number,
	j: number,
	k: number,
	value: number
) => {
	const newPitting = {
		teams: pittings[j][i].teams.map((team: any, idx: number) => ({
			...team,
			score: idx === k ? value : team.score || 0
		})),
		scoresheetId: pittings[j][i].scoresheetId,
		scoresheetOverridden: pittings[j][i].scoresheetOverridden
	};

	return newPitting;
};

const LadderTable = ({
	hideIfPublic,
	isSwiss,
	isSwissByPoints,
	ladderId,
	matches,
	pittings,
	publicLadderId,
	roomEditStatus,
	rooms,
	roundScoreEditStatuses,
	setPittings,
	setRooms,
	setRoundScoreEditStatuses,
	updateMatches
}: LadderTableProps) => {
	const [draggedRound, setDraggedRound] = useState<number | undefined>();

	const onScoreChange =
		(i: number, j: number, k: number) => (e: ChangeEvent<HTMLInputElement>) => {
			const value = parseInt(e.target.value);
			const newPitting = updatePittingScores(pittings, i, j, k, value);

			const newPittings = [
				...pittings.slice(0, j),
				[...pittings[j].slice(0, i), newPitting, ...pittings[j].slice(i + 1)],
				...pittings.slice(j + 1)
			];
			updateMatches(newPittings);
			setPittings(newPittings);
		};

	return (
		<table>
			<thead>
				<tr>
					{pittings.map((_, i: number) => (
						<th key={i} style={{ padding: "0 10px" }}>
							Round {i + 1}
							{(!matches ||
								matches[i].some(
									room => !room.scoresheetId || room.scoresheetOverridden
								)) &&
								hideIfPublic(
									<button
										style={{ marginLeft: "1.5em" }}
										onClick={() => {
											setRoundScoreEditStatuses([
												...roundScoreEditStatuses.slice(0, i),
												roundScoreEditStatuses[i] === EditingStatus.EDITING
													? EditingStatus.EDITED
													: EditingStatus.EDITING,
												...roundScoreEditStatuses.slice(i + 1)
											]);
										}}
									>
										{determineAddScoresButtonText(roundScoreEditStatuses[i])}
									</button>
								)}
						</th>
					))}
					{roomEditStatus === EditingStatus.NEW ? "" : <th>Room</th>}
				</tr>
			</thead>
			<tbody>
				{pittings[0].map((_, i: number) => (
					<tr key={i}>
						{pittings.map((_, j: number) => (
							<DraggableRoomDisplay
								key={`${j}:${i}`}
								editStatus={
									pittings[j][i].scoresheetId &&
									!pittings[j][i].scoresheetOverridden
										? EditingStatus.EDITED
										: roundScoreEditStatuses[j]
								}
								isAnyRoundEditingScore={roundScoreEditStatuses.some(
									round => round === EditingStatus.EDITING
								)}
								hideIfPublic={hideIfPublic}
								isDraggedRound={draggedRound === j}
								moveRoom={(sourceIdx: number) => {
									if (sourceIdx === i) {
										return;
									}

									const newPittings: MatchesV2 = [...pittings];
									let newRound;
									if (sourceIdx < i) {
										newRound = [
											...pittings[j].slice(0, sourceIdx),
											...pittings[j].slice(sourceIdx + 1, i + 1),
											pittings[j][sourceIdx],
											...pittings[j].slice(i + 1)
										];
									} else {
										newRound = [
											...pittings[j].slice(0, i),
											pittings[j][sourceIdx],
											...pittings[j].slice(i, sourceIdx),
											...pittings[j].slice(sourceIdx + 1)
										];
									}
									newPittings[j] = newRound;
									setPittings(newPittings);
									updateMatches(newPittings);
								}}
								onScoreChange={onScoreChange}
								pitting={pittings[j][i]}
								roomNumber={i}
								roundNumber={j}
								startDrag={() => setDraggedRound(j)}
								overrideScoresheet={() => {
									if (
										// eslint-disable-next-line no-restricted-globals
										confirm(
											"Are you sure you want to override the scoresheet? This can't be undone, but you'll still be able to see the scoresheet"
										)
									) {
										const newPitting = [...pittings];
										newPitting[j][i].scoresheetOverridden = true;
										setPittings(newPitting);
										updateMatches(newPitting);
									}
								}}
							/>
						))}
						{roomEditStatus === EditingStatus.NEW ? (
							""
						) : (
							<td className="room-cell" data-testid="room">
								{roomEditStatus === EditingStatus.EDITING ? (
									<textarea
										data-testid="room-input"
										value={rooms[i]}
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
											setRooms([
												...rooms.slice(0, i),
												e.target.value,
												...rooms.slice(i + 1)
											])
										}
									/>
								) : (
									rooms[i]
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
