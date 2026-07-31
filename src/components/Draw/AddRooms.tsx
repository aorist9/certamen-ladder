import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/material/TextareaAutosize";

interface Props {
	divisionOrTournament: "division" | "tournament";
	savedRooms: string[];
	updateRooms: (rooms: string[]) => void;
}

const AddRooms = ({ divisionOrTournament, savedRooms, updateRooms }: Props) => {
	const [rooms, setRooms] = useState<{ value: string; editing: boolean }[]>(
		savedRooms.map(rm => ({ value: rm, editing: false }))
	);
	return (
		<Box component="section" className="add-rooms">
			<Typography variant="body2" sx={{ mb: 1 }}>
				You can add rooms/moderators to this {divisionOrTournament} if you want
				by clicking below. You can also add them after the ladder is generated
				or not add them at all. It's your world.
			</Typography>
			<Stack spacing={1} sx={{ mb: 1 }}>
				{rooms.map((room, idx) => {
					if (room.editing) {
						return (
							<Stack component="div" key={idx} direction="row" spacing={1} sx={{ alignItems: "center" }}>
								<TextareaAutosize
                  aria-label="room name"
                  minRows={2}
									value={room.value}
									autoFocus={true}
									onChange={e =>
										setRooms([
											...rooms.slice(0, idx),
											{ value: e.target.value, editing: true },
											...rooms.slice(idx + 1)
										])
									}
								/>
								<Button
                  variant="contained"
									onClick={() => {
										const newRooms = [
											...rooms.slice(0, idx),
											{ value: room.value, editing: false },
											...rooms.slice(idx + 1)
										];
										setRooms(newRooms);
										updateRooms(newRooms.map(room => room.value));
									}}
								>
									Save
								</Button>
							</Stack>
						);
					} else {
						return (
							<Stack

								key={idx}
								direction="row"
								spacing={1}
								sx={{ alignItems: "center" }}
							>
								<Typography>{room.value}</Typography>
								<Button
                  variant="contained"
									onClick={() =>
										setRooms([
											...rooms.slice(0, idx),
											{ value: room.value, editing: true },
											...rooms.slice(idx + 1)
										])
									}
								>
									Edit
								</Button>
								<Button
                  variant="outlined"
									onClick={() => {
										const newRooms = [
											...rooms.slice(0, idx),
											...rooms.slice(idx + 1)
										];
										setRooms(newRooms);
										updateRooms(newRooms.map(room => room.value));
									}}
								>
									Remove
								</Button>
							</Stack>
						);
					}
				})}
				<Button
					variant="contained"
					onClick={() => setRooms([...rooms, { value: "", editing: true }])}
				>
					+ Add Room
				</Button>
			</Stack>
		</Box>
	);
};

export default AddRooms;
