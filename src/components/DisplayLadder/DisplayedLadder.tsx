import React, { useEffect, useState } from "react";
import features from "../../features.json";
import { Ladder } from "../../types/LadderType";
import { MatchesV2 } from "../../types/Matches";
import pittingService from "../../services/pittingService";
import LadderTable from "./LadderTable";
import Teams from "../../types/Teams";
import { EMPTY_QUESTIONS, LadderStyle } from "../../constants";
import { v4 as uuid } from "uuid";
import scoreSheetService from "../../services/scoreSheetService";
import ladderService from "../../services/ladderService";

type DisplayedLadderProps = {
	divisionNumber?: number;
	hideIfPublic: (
		elem: string | JSX.Element | JSX.Element[]
	) => string | JSX.Element | JSX.Element[];
	ladder: Ladder;
	name?: string;
	updateLadder: VoidFunction;
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
	updateLadder,
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

	const { matches } = division;
	const [pittings, setPittings] = useState<MatchesV2>(
		matches ||
			pittingService
				.generateInitialPittings(ladder, divisionNumber || 0)
				.map(round =>
					round.map(room => ({ teams: room.map(team => ({ team })) }))
				)
	);

	useEffect(() => {
		if (matches) {
			setPittings(matches);
		}
	}, [matches]);

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
					{features.codeSheet &&
						pittings.every(round => round.every(room => !room.scoresheetId)) &&
						hideIfPublic(
							<button
								className="hide-print"
								style={{ marginLeft: "1em" }}
								onClick={async () => {
									if (
										// eslint-disable-next-line no-restricted-globals
										confirm(
											"Are you sure you want to create scoresheets?" +
												" You will not be able to add or remove teams from the ladder once you create scoresheets," +
												" and any scores you have already entered will be wiped out," +
												` though you'll be able to re-enter them. ${
													ladder.publicId
														? ""
														: "This will also cause the ladder to be published."
												}`
										)
									) {
										if (!ladder.publicId) {
											await ladderService.publishLadder(ladder);
										}

										const newPittings = pittings.map(round =>
											round.map(room => {
												if (room.scoresheetId) {
													return room;
												}

												const scoresheetId = uuid();
												scoreSheetService.addScoreSheet({
													id: scoresheetId,
													teams: room.teams.map(team => ({
														name: team.team,
														players: Array(4).fill("")
													})),
													questions: EMPTY_QUESTIONS
												});
												return {
													...room,
													scoresheetId
												};
											})
										);
										updateMatches(
											pittings.map(round =>
												round.map(room => {
													const scoresheetId = uuid();
													scoreSheetService.addScoreSheet(
														{
															id: scoresheetId,
															teams: room.teams.map(team => ({
																name: team.team,
																players: Array(4).fill("")
															})),
															questions: EMPTY_QUESTIONS
														},
														ladder.id
													);
													return {
														...room,
														scoresheetId
													};
												})
											)
										);
										setPittings(newPittings);
										updateLadder();
									}
								}}
							>
								Use Score Sheets
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
					hideIfPublic={hideIfPublic}
					isSwiss={ladder.isSwiss()}
					isSwissByPoints={ladder.ladderType === LadderStyle.SWISS_BY_POINTS}
					ladderId={ladder.id}
					matches={division.matches}
					pittings={pittings}
					publicLadderId={ladder.publicId}
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
