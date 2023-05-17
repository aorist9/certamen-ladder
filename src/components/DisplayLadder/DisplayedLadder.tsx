import React, { ChangeEvent, useState } from "react";
import LadderType from "../../types/LadderType";
import Matches from "../../types/Matches";
import pittingService from "../../services/pittingService";
import TeamDisplay from "./TeamDisplay";
import addSwissPoints from "./addSwissPoints";

type DisplayedLadderProps = {
	ladder: LadderType;
	name?: string;
	updateMatches: (matches: Matches) => void;
	updateRooms: (rooms: string[]) => void;
};

export enum EditingStatus {
	NEW = "Add Rooms",
	EDITING = "Done Adding Rooms",
	EDITED = "Edit Rooms"
}

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

const DisplayedLadder = (props: DisplayedLadderProps) => {
	const { ladder, name } = props;
	const [roomEditStatus, setRoomEditStatus] = useState<EditingStatus>(
		ladder.rooms ? EditingStatus.EDITED : EditingStatus.NEW
	);

	const [pittings, setPittings] = useState<Matches>(
		ladder.matches ||
			pittingService
				.generateInitialPittings(ladder)
				.map(round => round.map(room => room.map(team => ({ team }))))
	);

	const [rooms, setRooms] = useState<string[]>(
		ladder.rooms || pittings[0].map(() => "")
	);

	const [roundScoreEditStatuses, setRoundScoreEditStatuses] = useState<
		EditingStatus[]
	>(pittings.map(() => EditingStatus.NEW));

	const onScoreChange =
		(i: number, j: number, k: number) => (e: ChangeEvent<HTMLInputElement>) => {
			const newPitting: {
				team: string;
				score?: number;
			}[] = [...pittings[j][i]];
			newPitting[k].score = parseInt(e.target.value);
			for (let idx = 0; idx < newPitting.length; idx++) {
				if (!newPitting[idx].score) {
					newPitting[idx].score = 0;
				}
			}

			const newPittings = [
				...pittings.slice(0, j),
				[...pittings[j].slice(0, i), newPitting, ...pittings[j].slice(i + 1)],
				...pittings.slice(j + 1)
			];
			props.updateMatches(newPittings);
			setPittings(newPittings);
		};

	if (ladder && pittings && pittings.length) {
		return (
			<section className="displayed-ladder">
				<h3>
					{name || ""}
					<button
						style={{ marginLeft: "1em" }}
						onClick={() => {
							if (roomEditStatus === EditingStatus.EDITING) {
								setRoomEditStatus(EditingStatus.EDITED);
								props.updateRooms(rooms);
							} else {
								setRoomEditStatus(EditingStatus.EDITING);
							}
						}}
					>
						{roomEditStatus}
					</button>
					{ladder.type === 1 &&
					pittings[pittings.length - 1][0][0].swissPoints !== undefined &&
					ladder.rounds > pittings.length ? (
						<button
							style={{ marginLeft: "1em" }}
							onClick={() => {
								let newPittings = [...pittings];
								newPittings.push(
									pittingService
										.generateNextSwissRound({
											...ladder,
											matches: newPittings
										})
										.map(room => room.map(team => ({ team })))
								);
								props.updateMatches(newPittings);
								setPittings(newPittings);
								setRoundScoreEditStatuses([
									...roundScoreEditStatuses,
									EditingStatus.NEW
								]);
							}}
						>
							Generate Next Round
						</button>
					) : (
						""
					)}
				</h3>
				<table>
					<thead>
						<tr>
							{pittings.map((_, i: number) => (
								<th key={i}>
									Round {i + 1}
									<button
										style={{ marginLeft: "1.5em" }}
										onClick={() => {
											if (
												roundScoreEditStatuses[i] === EditingStatus.EDITING &&
												ladder.type === 1
											) {
												let newPittings = [
													...pittings.slice(0, i),
													pittings[i].map(addSwissPoints),
													...pittings.slice(i + 1)
												];

												props.updateMatches(newPittings);
												setPittings(newPittings);
											}

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
								</th>
							))}
							{roomEditStatus === EditingStatus.NEW ? "" : <th>Room</th>}
						</tr>
					</thead>
					<tbody>
						{pittings[0].map((_, i: number) => (
							<tr key={i}>
								{pittings.map((_, j: number) => (
									<td key={`${j}:${i}`} data-testid={`round-${j + 1}`}>
										<ul>
											{pittings[j][i].map(({ team, score, swissPoints }, k) => (
												<TeamDisplay
													key={team}
													onScoreChange={onScoreChange(i, j, k)}
													roundEditStatus={roundScoreEditStatuses[j]}
													score={score}
													swissPoints={swissPoints}
													team={team}
												/>
											))}
										</ul>
									</td>
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
			</section>
		);
	} else {
		return <></>;
	}
};

export default DisplayedLadder;
