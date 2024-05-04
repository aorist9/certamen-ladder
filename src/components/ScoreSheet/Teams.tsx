import React, { useState } from "react";
import ScoreSheetTeam from "./ScoreSheetTeam";
import Players from "./Players";

const LETTERS: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

export interface Player {
	name: string;
	isCaptain?: boolean;
}

interface Props {
	players: Record<string, Player[]>;
	teams: string[];
	setPlayers: (players: Record<string, Player[]>) => void;
	setTeams: (teams: string[]) => void;
}

const ScoreSheet = ({ players, teams, setPlayers, setTeams }: Props) => {
	const [playerEditingTeam, setPlayerEditingTeam] = useState<
		number | undefined
	>();

	if (playerEditingTeam !== undefined) {
		return (
			<Players
				done={() => setPlayerEditingTeam(undefined)}
				letter={LETTERS[playerEditingTeam]}
				team={teams[playerEditingTeam]}
				players={players[teams[playerEditingTeam]]}
				setPlayers={(newPlayers: Player[]) => {
					setPlayers({
						...players,
						[teams[playerEditingTeam]]: newPlayers
					});
				}}
			/>
		);
	} else {
		return (
			<ul className="teams">
				{teams.map((team, idx) => (
					<>
						<ScoreSheetTeam
							key={team}
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
							team={team}
						/>
						<ul className="print-only">
							{players[team].map((player, playerIdx) => {
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
					</>
				))}
			</ul>
		);
	}
};

export default ScoreSheet;
