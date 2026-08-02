import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";

type DivisionTabProps = {
	changeName: (name: string) => void;
	idx: number;
	name: string;
	select: () => void;
};

const DivisionTab = (props: DivisionTabProps) => {
	const [name, setName] = useState<string>(props.name);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	return (
		<Tab
			component="button"
			onClick={() => {
				props.select();
			}}
			onDoubleClick={() => {
				setIsEditing(true);
			}}
			value={props.idx}
			label={
				isEditing ? (
					<TextField
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
				) : (
					name
				)
			}
		/>
	);
};

export default DivisionTab;
