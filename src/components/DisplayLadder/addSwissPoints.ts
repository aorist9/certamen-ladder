import { RoomV2 } from "../../types/Matches";

const addSwissPoints = (room: RoomV2) => {
	let newRoom = { ...room };
	newRoom.teams.sort((team1, team2) => (team2.score || 0) - (team1.score || 0));

	if (newRoom.teams.length > 2) {
		if ((newRoom.teams[0].score || 0) > (newRoom.teams[1].score || 0)) {
			newRoom.teams[0].swissPoints = 3;
			if ((newRoom.teams[1].score || 0) > (newRoom.teams[2].score || 0)) {
				newRoom.teams[1].swissPoints = 2;
				newRoom.teams[2].swissPoints = 1;
			} else {
				newRoom.teams[1].swissPoints = newRoom.teams[2].swissPoints = 1.5;
			}
		} else if ((newRoom.teams[0].score || 0) > (newRoom.teams[2].score || 0)) {
			newRoom.teams[0].swissPoints = newRoom.teams[1].swissPoints = 2.5;
			newRoom.teams[2].swissPoints = 1;
		} else {
			newRoom.teams[0].swissPoints =
				newRoom.teams[1].swissPoints =
				newRoom.teams[2].swissPoints =
					2;
		}
	} else {
		if ((newRoom.teams[0].score || 0) > (newRoom.teams[1].score || 0)) {
			newRoom.teams[0].swissPoints = 3;
			newRoom.teams[1].swissPoints = 2;
		} else {
			newRoom.teams[0].swissPoints = newRoom.teams[1].swissPoints = 2.5;
		}
	}

	return newRoom;
};

export const addSwissByPointsPoints = (room: RoomV2, round: RoomV2[]) => {
	const midPoints = determineMidPoints(round);
	return {
		teams: room.teams.map(team => {
			let swissPoints = 1;
			if (team.score && team.score >= midPoints[1]) {
				swissPoints = 3;
			} else if (team.score && team.score >= midPoints[0]) {
				swissPoints = 2;
			}

			return { ...team, swissPoints };
		})
	};
};

const determineMidPoints = (round: RoomV2[]): number[] => {
	const scores: number[] = round.reduce(
		(acc, room) =>
			[
				...acc,
				...room.teams.reduce((roomAcc, team) => {
					if (team.score) {
						return [...roomAcc, team.score];
					} else {
						return roomAcc;
					}
				}, [] as number[])
			] as number[],
		[] as number[]
	);

	scores.sort((a, b) => a - b);

	return [
		scores[Math.floor(scores.length / 3)],
		scores[Math.ceil((scores.length * 2) / 3)]
	];
};

export default addSwissPoints;
