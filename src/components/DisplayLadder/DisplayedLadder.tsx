import React, { useState } from "react";
import { Ladder } from "../../types/LadderType";
import { MatchesV2 } from "../../types/Matches";
import pittingService from "../../services/pittingService";
import LadderTable from "./LadderTable";
import Teams from "../../types/Teams";
import { LadderStyle } from "../../constants";

type DisplayedLadderProps = {
	divisionNumber?: number;
	hideIfPublic: (
		elem: string | JSX.Element | JSX.Element[]
	) => string | JSX.Element | JSX.Element[];
	ladder: Ladder;
	name?: string;
	updateMatches: (matches: MatchesV2) => void;
	updateRooms: (rooms: string[]) => void;
};

export enum EditingStatus {
	NEW = "Add Rooms",
	EDITING = "Done Adding Rooms",
	EDITED = "Edit Rooms"
}

const DisplayedLadder = ({
	divisionNumber,
	hideIfPublic,
	ladder,
	name,
	updateMatches,
	updateRooms
}: DisplayedLadderProps) => {
	const division = ladder.divisions?.[divisionNumber || 0] as {
		division?: string;
		teams: Teams;
		threeRooms?: boolean;
		rooms?: string[];
		matches?: MatchesV2;
	};
	const [roomEditStatus, setRoomEditStatus] = useState<EditingStatus>(
		division.rooms && division.rooms.length
			? EditingStatus.EDITED
			: EditingStatus.NEW
	);

	const [pittings, setPittings] = useState<MatchesV2>(
		division.matches ||
			pittingService
				.generateInitialPittings(ladder, divisionNumber || 0)
				.map(round =>
					round.map(room => ({ teams: room.map(team => ({ team })) }))
				)
	);

	const [rooms, setRooms] = useState<string[]>(
		division.rooms || (pittings.length ? pittings[0].map(() => "") : [])
	);

	const [roundScoreEditStatuses, setRoundScoreEditStatuses] = useState<
		EditingStatus[]
	>(pittings.map(() => EditingStatus.NEW));

	if (ladder && pittings && pittings.length) {
		return (
			<section className="displayed-ladder">
				<h3>
					{name || ""}
					{hideIfPublic(
						<button
							style={{ marginLeft: "1em" }}
							onClick={() => {
								if (roomEditStatus === EditingStatus.EDITING) {
									setRoomEditStatus(EditingStatus.EDITED);
									updateRooms(rooms);
								} else {
									setRoomEditStatus(EditingStatus.EDITING);
								}
							}}
						>
							{roomEditStatus}
						</button>
					)}
					{ladder.isSwiss() &&
					pittings[pittings.length - 1][0].teams[0].swissPoints !== undefined &&
					ladder.numRounds > pittings.length
						? hideIfPublic(
								<button
									style={{ marginLeft: "1em" }}
									onClick={() => {
										let newPittings = [...pittings];
										if (ladder?.divisions && ladder.divisions.length) {
											ladder.divisions[divisionNumber || 0].matches =
												newPittings;
										}
										newPittings.push(
											pittingService
												.generateNextSwissRound(ladder, divisionNumber || 0)
												.map(room => ({ teams: room.map(team => ({ team })) }))
										);
										updateMatches(newPittings);
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
					divisionNumber={divisionNumber}
					hideIfPublic={hideIfPublic}
					isSwiss={ladder.isSwiss()}
					isSwissByPoints={ladder.ladderType === LadderStyle.SWISS_BY_POINTS}
					matches={division.matches}
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
