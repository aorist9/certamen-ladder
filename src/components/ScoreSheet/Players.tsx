import React, { ChangeEvent, useState } from "react";
import { Player } from "../../routes/ScoreSheet";

const Players = ({
	done,
	letter,
	team,
	players,
	setPlayers
}: {
	done: VoidFunction;
	letter: "A" | "B" | "C" | "D";
	team: string;
	players: Player[];
	setPlayers: (players: Player[]) => void;
}) => {
	const [captain, setCaptain] = useState<number | undefined>();

	return (
		<section className="players">
			<h2>{team} Players</h2>
			<table className="players-table">
				<thead>
					<tr>
						<th colSpan={2}>Player</th>
						<th>Captain</th>
					</tr>
				</thead>
				<tbody>
					{players.map((player, idx) => (
						<tr className="player-input" key={idx}>
							<td>
								{letter}
								{idx + 1}
							</td>
							<td>
								<input
									type="text"
									value={player.name}
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										setPlayers([
											...players.slice(0, idx),
											{ name: e.target.value, isCaptain: captain === idx },
											...players.slice(idx + 1)
										]);
									}}
								/>
							</td>
							<td style={{ display: "flex", justifyContent: "center" }}>
								<input
									type="radio"
									name="captain"
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										if (e.target.checked) {
											setCaptain(idx);
										}

										setPlayers(
											players.map((player, playerIdx) => ({
												name: player.name,
												isCaptain: idx === playerIdx
											}))
										);
									}}
									checked={captain === idx}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<button className="done-button btn-success" onClick={done}>
				Done
			</button>
		</section>
	);
};

export default Players;
