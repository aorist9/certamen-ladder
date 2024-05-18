import React, { useState } from "react";
import TeamDisplay from "./TeamDisplay";
import Players from "./Players";
import { useRoundContext } from "../../contexts/RoundContext";
import { LETTERS } from "../../types/Round";

export interface Player {
	name: string;
	isCaptain?: boolean;
}

const Teams = () => {
	const { teams, setTeams } = useRoundContext();

	const [playerEditingTeam, setPlayerEditingTeam] = useState<
		number | undefined
	>();

	if (playerEditingTeam !== undefined) {
		return (
			<Players
				done={() => setPlayerEditingTeam(undefined)}
				letter={LETTERS[playerEditingTeam]}
				team={teams[playerEditingTeam].name}
				players={teams[playerEditingTeam].players}
				setPlayers={(newPlayers: Player[]) => {
					setTeams([
						...teams.slice(0, playerEditingTeam),
						{
							...teams[playerEditingTeam],
							players: newPlayers
						},
						...teams.slice(playerEditingTeam + 1)
					]);
				}}
			/>
		);
	} else {
		return (
			<ul className="teams">
				{teams.map((team, idx) => (
					<React.Fragment key={team.name}>
						<TeamDisplay
							addPlayers={() => setPlayerEditingTeam(idx)}
							letter={LETTERS[idx]}
							moveDown={
								idx < teams.length - 1
									? () => {
											setTeams([
												...teams.slice(0, idx),
												teams[idx + 1],
												team,
												...teams.slice(idx + 2)
											]);
									  }
									: undefined
							}
							moveUp={
								idx > 0
									? () => {
											setTeams([
												...teams.slice(0, idx - 1),
												team,
												teams[idx - 1],
												...teams.slice(idx + 1)
											]);
									  }
									: undefined
							}
							team={team.name}
						/>
						<ul className="print-only">
							{team.players.map((player, playerIdx) => {
								if (player?.name && player.name.trim() !== "") {
									return (
										<li
											key={`${playerIdx}${player.name}`}
											style={{ listStyle: "none" }}
										>
											<span style={{ marginRight: "1em" }}>
												{LETTERS[idx]}
												{playerIdx + 1}
											</span>
											{player.isCaptain ? "*" : ""}
											{player.name}
										</li>
									);
								} else {
									return <React.Fragment key={playerIdx}></React.Fragment>;
								}
							})}
						</ul>
					</React.Fragment>
				))}
			</ul>
		);
	}
};

export default Teams;
