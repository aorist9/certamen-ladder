import React, { ChangeEvent, useMemo, useState } from "react";
import LadderType from "../types/LadderType";
import pittingService from "../services/pittingService";

type DisplayedLadderProps = {
	ladder: LadderType;
	name?: string;
	updateRooms: (rooms: string[]) => void;
};

enum EditingStatus {
	NEW = "Add Rooms",
	EDITING = "Done Adding Rooms",
	EDITED = "Edit Rooms"
}

const DisplayedLadder = (props: DisplayedLadderProps) => {
	const { ladder, name } = props;
	const [editStatus, setEditStatus] = useState<EditingStatus>(
		ladder.rooms ? EditingStatus.EDITED : EditingStatus.NEW
	);

	const pittings: string[][][] = useMemo(
		() => pittingService.generateInitialPittings(ladder),
		[ladder]
	);

	const [rooms, setRooms] = useState<string[]>(
		ladder.rooms || pittings[0].map(() => "")
	);

	if (ladder && pittings && pittings.length) {
		return (
			<section className="displayed-ladder">
				<h3>
					{name || ""}
					<button
						style={{ marginLeft: "1em" }}
						onClick={() => {
							if (editStatus === EditingStatus.EDITING) {
								setEditStatus(EditingStatus.EDITED);
								props.updateRooms(rooms);
							} else {
								setEditStatus(EditingStatus.EDITING);
							}
						}}
					>
						{editStatus}
					</button>
				</h3>
				<table>
					<thead>
						<tr>
							{pittings.map((_, i: number) => (
								<th key={i}>Round {i + 1}</th>
							))}
							{editStatus === EditingStatus.NEW ? "" : <th>Room</th>}
						</tr>
					</thead>
					<tbody>
						{pittings[0].map((_, i: number) => (
							<tr key={i}>
								{pittings.map((_, j: number) => (
									<td key={`${j}:${i}`} data-testid={`round-${j + 1}`}>
										<ul>
											{pittings[j][i].map((team: string) => (
												<li key={team}>{team}</li>
											))}
										</ul>
									</td>
								))}
								{editStatus === EditingStatus.NEW ? (
									""
								) : (
									<td className="room-cell" data-testid="room">
										{editStatus === EditingStatus.EDITING ? (
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
