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

export default addSwissPoints;
