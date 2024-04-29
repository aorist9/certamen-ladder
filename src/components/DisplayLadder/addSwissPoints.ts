import { MatchTeam } from "../../types/Matches";

const addSwissPoints = (
	room: { team: string; score?: number; swissPoints?: number }[]
) => {
	let newRoom = [...room];
	newRoom.sort((team1, team2) => (team2.score || 0) - (team1.score || 0));

	if (newRoom.length > 2) {
		if ((newRoom[0].score || 0) > (newRoom[1].score || 0)) {
			newRoom[0].swissPoints = 3;
			if ((newRoom[1].score || 0) > (newRoom[2].score || 0)) {
				newRoom[1].swissPoints = 2;
				newRoom[2].swissPoints = 1;
			} else {
				newRoom[1].swissPoints = newRoom[2].swissPoints = 1.5;
			}
		} else if ((newRoom[0].score || 0) > (newRoom[2].score || 0)) {
			newRoom[0].swissPoints = newRoom[1].swissPoints = 2.5;
			newRoom[2].swissPoints = 1;
		} else {
			newRoom[0].swissPoints =
				newRoom[1].swissPoints =
				newRoom[2].swissPoints =
					2;
		}
	} else {
		if ((newRoom[0].score || 0) > (newRoom[1].score || 0)) {
			newRoom[0].swissPoints = 3;
			newRoom[1].swissPoints = 2;
		} else {
			newRoom[0].swissPoints = newRoom[1].swissPoints = 2.5;
		}
	}

	return newRoom;
};

export const addSwissByPointsPoints = (
	room: MatchTeam[],
	round: MatchTeam[][]
) => {
	const midPoints = determineMidPoints(round);
	return room.map(team => {
		let swissPoints = 1;
		if (team.score && team.score >= midPoints[1]) {
			swissPoints = 3;
		} else if (team.score && team.score >= midPoints[0]) {
			swissPoints = 2;
		}

		return { ...team, swissPoints };
	});
};

const determineMidPoints = (round: MatchTeam[][]): number[] => {
	const scores: number[] = round.reduce(
		(acc, room) =>
			[
				...acc,
				...room.reduce((roomAcc, team) => {
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
