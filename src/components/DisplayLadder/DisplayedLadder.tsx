import React, { useState } from "react";
import LadderType from "../../types/LadderType";
import Matches from "../../types/Matches";
import pittingService from "../../services/pittingService";
import LadderTable from "./LadderTable";

type DisplayedLadderProps = {
	hideIfPublic: (
		elem: string | JSX.Element | JSX.Element[]
	) => string | JSX.Element | JSX.Element[];
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

const DisplayedLadder = (props: DisplayedLadderProps) => {
	const { ladder, name, updateMatches } = props;
	const [roomEditStatus, setRoomEditStatus] = useState<EditingStatus>(
		ladder.rooms && ladder.rooms.length
			? EditingStatus.EDITED
			: EditingStatus.NEW
	);

	const [pittings, setPittings] = useState<Matches>(
		ladder.matches ||
			pittingService
				.generateInitialPittings(ladder)
				.map(round => round.map(room => room.map(team => ({ team }))))
	);

	const [rooms, setRooms] = useState<string[]>(
		ladder.rooms || (pittings.length ? pittings[0].map(() => "") : [])
	);

	const [roundScoreEditStatuses, setRoundScoreEditStatuses] = useState<
		EditingStatus[]
	>(pittings.map(() => EditingStatus.NEW));

	if (ladder && pittings && pittings.length) {
		return (
			<section className="displayed-ladder">
				<h3>
					{name || ""}
					{props.hideIfPublic(
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
					)}
					{(ladder.type === 1 || ladder.type === 2) &&
					pittings[pittings.length - 1][0][0].swissPoints !== undefined &&
					ladder.rounds > pittings.length
						? props.hideIfPublic(
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
						  )
						: ""}
				</h3>
				<LadderTable
					hideIfPublic={props.hideIfPublic}
					isSwiss={ladder.type === 1 || ladder.type === 2}
					isSwissByPoints={ladder.type === 2}
					pittings={pittings}
					roomEditStatus={roomEditStatus}
					rooms={rooms}
					roundScoreEditStatuses={roundScoreEditStatuses}
					setPittings={setPittings}
					setRooms={setRooms}
					setRoundScoreEditStatuses={setRoundScoreEditStatuses}
					updateMatches={updateMatches}
				/>
			</section>
		);
	} else {
		return <></>;
	}
};

export default DisplayedLadder;
