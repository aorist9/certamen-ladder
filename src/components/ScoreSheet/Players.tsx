import React, { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
		<Box
			sx={{ width: { xs: "100%", lg: "60%", xl: "50%" } }}
			className="players-container"
		>
			<Stack direction="column" className="players">
				<Typography variant="h3">{team} Players</Typography>
				<Table className="players-table">
					<TableHead>
						<TableRow>
							<TableCell colSpan={2}>Player</TableCell>
							<TableCell sx={{ textAlign: "center" }}>Captain</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{players.map((player, idx) => (
							<TableRow className="player-input" key={idx}>
								<TableCell>
									<Typography variant="body1">
										{letter}
										{idx + 1}
									</Typography>
								</TableCell>
								<TableCell>
									<TextField
										label="Player Name"
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
								</TableCell>
								<TableCell
									style={{
										display: "flex",
										justifyContent: "center",
										paddingBottom: "30px"
									}}
								>
									<Radio
										name="captain"
										value={idx}
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
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Button
					className="done-button btn-success"
					onClick={done}
					variant="contained"
				>
					Done
				</Button>
			</Stack>
		</Box>
	);
};

export default Players;
