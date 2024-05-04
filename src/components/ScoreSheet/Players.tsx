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
								<label htmlFor={`${letter}${idx + 1}`}>
									{letter}
									{idx + 1}
								</label>
							</td>
							<td>
								<input
									type="text"
									name={`${letter}${idx + 1}`}
									value={player.name}
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										setPlayers([
											...players.slice(0, idx),
											{ name: e.target.value, isCaptain: player.isCaptain },
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
										setPlayers(
											players.map((player, playerIdx) => ({
												name: player.name,
												isCaptain: idx === playerIdx
											}))
										);
									}}
									checked={player.isCaptain}
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
