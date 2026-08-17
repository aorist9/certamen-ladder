import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Ladder } from "../../types/LadderType";
import { MatchesV2 } from "../../types/Matches";
import pittingService from "../../services/pittingService";
import LadderTable from "./LadderTable";
import Teams from "../../types/Teams";
import { EMPTY_QUESTIONS, LadderStyle } from "../../constants";
import { v4 as uuid } from "uuid";
import scoreSheetService from "../../services/scoreSheetService";
import ladderService from "../../services/ladderService";
import { useFeatureFlags } from "../../contexts/featureFlagsContext";
import addSwissPoints, { addSwissByPointsPoints } from "./addSwissPoints";
import UseScoreSheetsButton from "./UseScoreSheetsButton";

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
	const { codeSheet: codeSheetFlag } = useFeatureFlags();
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
			<Box className="displayed-ladder">
				<Typography variant="h3">
					{name || ""}
					{hideIfPublic(
						<Button
							sx={{ ml: "1em" }}
							className="hide-print"
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
						</Button>
					)}
					{codeSheetFlag &&
						pittings.every(round => round.every(room => !room.scoresheetId)) &&
						hideIfPublic(
							<UseScoreSheetsButton
								isLadderPublished={!!ladder.publicId}
								onYes={async () => {
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
									setRoundScoreEditStatuses(
										roundScoreEditStatuses.map(() => EditingStatus.EDITED)
									);
								}}
							/>
						)}
					{ladder.isSwiss() &&
					(pittings[pittings.length - 1][0].teams[0].swissPoints !==
						undefined ||
						ladder.numRounds > pittings.length)
						? hideIfPublic(
								<Button
									sx={{ ml: "1em" }}
									onClick={() => {
										let newPittings = [...pittings];
										newPittings[newPittings.length - 1] = newPittings[
											newPittings.length - 1
										].map(room => {
											if (ladder?.ladderType === LadderStyle.SWISS_BY_POINTS) {
												return addSwissByPointsPoints(
													room,
													newPittings[newPittings.length - 1]
												);
											} else {
												return addSwissPoints(room);
											}
										});

										if (ladder?.divisions && ladder.divisions.length) {
											ladder.divisions[divisionNumber || 0].matches =
												newPittings;
										}
										if (ladder.numRounds > pittings.length) {
											newPittings.push(
												pittingService
													.generateNextSwissRound(ladder, divisionNumber || 0)
													.map(room => {
														const scoresheetId = uuid();
														scoreSheetService.addScoreSheet(
															{
																id: scoresheetId,
																teams: room.map(team => ({
																	name: team,
																	players: Array(4).fill("")
																})),
																questions: EMPTY_QUESTIONS
															},
															ladder.id
														);
														return {
															scoresheetId,
															teams: room.map(team => ({ team }))
														};
													})
											);
										}
										updateMatches(newPittings);
										setPittings(newPittings);
										if (ladder.numRounds > pittings.length) {
											setRoundScoreEditStatuses([
												...roundScoreEditStatuses,
												EditingStatus.NEW
											]);
										}
									}}
								>
									Finish Round
									{ladder.numRounds > pittings.length
										? "/Generate Next Round"
										: ""}
								</Button>
							)
						: ""}
				</Typography>
				<LadderTable
					divisionIdx={divisionNumber || 0}
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
			</Box>
		);
	} else {
		return <></>;
	}
};

export default DisplayedLadder;
