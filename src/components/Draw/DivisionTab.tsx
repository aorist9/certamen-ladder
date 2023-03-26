import React, { ChangeEvent, KeyboardEvent, useState } from "react";

type DivisionTabProps = {
	changeName: (name: string) => void;
	isSelected: boolean;
	name: string;
	select: () => void;
};

const DivisionTab = (props: DivisionTabProps) => {
	const [name, setName] = useState<string>(props.name);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	return (
		<li>
			{isEditing ? (
				<input
					type="text"
					value={name}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setName(e.target.value)
					}
					onBlur={() => {
						props.changeName(name);
						setIsEditing(false);
					}}
					onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							props.changeName(name);
							setIsEditing(false);
						}
					}}
				/>
			) : props.isSelected ? (
				<button className="active" onDoubleClick={() => setIsEditing(true)}>
					{name}
				</button>
			) : (
				<button onClick={() => props.select()}>{name}</button>
			)}
		</li>
	);
};

export default DivisionTab;
