import React, { ChangeEvent } from "react";
import { TextField } from "@mui/material";

type NumberInputProps = {
	id: string;
	label: string;
	value: number | undefined;
	setValue: (value: number | undefined) => void;
};

const NumberInput = (props: NumberInputProps) => (
	<TextField
		id={props.id}
		label={props.label}
		variant="standard"
		type="number"
		value={props.value ?? ""}
		fullWidth
		sx={{ maxWidth: 320 }}
		onChange={(e: ChangeEvent<HTMLInputElement>) => {
			const val = parseInt(e.target.value, 10);
			props.setValue(isNaN(val) ? undefined : val);
		}}
	/>
);

export default NumberInput;
