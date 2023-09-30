import React, { ChangeEvent, useState } from "react";

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
		<section className="add-rooms">
			<p>
				You can add rooms/moderators to this {divisionOrTournament} if you want
				by clicking below. You can also add them after the ladder is generated
				or not add them at all. It's your world.
			</p>
			<section
				style={{ display: "flex", flexDirection: "column", rowGap: "1em" }}
			>
				{rooms.map((room, idx) => {
					if (room.editing) {
						return (
							<div key={idx} style={{ display: "flex", flexDirection: "row" }}>
								<textarea
									value={room.value}
									autoFocus={true}
									onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
										setRooms([
											...rooms.slice(0, idx),
											{ value: e.target.value, editing: true },
											...rooms.slice(idx + 1)
										])
									}
								/>
								<button
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
								</button>
							</div>
						);
					} else {
						return (
							<div
								key={idx}
								style={{
									display: "flex",
									flexDirection: "row",
									columnGap: "1em"
								}}
							>
								<span style={{ minWidth: "4rem" }}>{room.value}</span>
								<button
									onClick={() =>
										setRooms([
											...rooms.slice(0, idx),
											{ value: room.value, editing: true },
											...rooms.slice(idx + 1)
										])
									}
								>
									Edit
								</button>
								<button
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
								</button>
							</div>
						);
					}
				})}
				<button
					onClick={() => setRooms([...rooms, { value: "", editing: true }])}
				>
					+ Add Room
				</button>
			</section>
		</section>
	);
};

export default AddRooms;
