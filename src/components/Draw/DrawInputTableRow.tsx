import React, { ChangeEvent } from "react";
import TextField from "@mui/material/TextField";

export type DrawRow = {
	letter?: string;
	team?: string;
	error?: string;
};

const DrawInputTableRow = (props: {
	row: DrawRow;
	onChange: (value: DrawRow) => void;
	idx: number;
}) => (
	<tr data-testid="ladder-input-row">
		<td>
			<TextField
				id={`letter-${props.idx}`}
				type="text"
				size="small"
				slotProps={{
					htmlInput: {
						style: { maxWidth: "4em" },
						"data-testid": "letter-input",
						"aria-describedby": "letter-header",
						"aria-labelledby": "letter-header"
					}
				}}
				value={props.row.letter || ""}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					props.onChange({ ...props.row, letter: e.target.value });
				}}
			/>
		</td>
		<td>
			<TextField
				id={`team-${props.idx}`}
				type="text"
				size="small"
				slotProps={{
					htmlInput: {
						"data-testid": "team-input",
						"aria-describedby": "team-header",
						"aria-labelledby": "team-header"
					}
				}}
				value={props.row.team || ""}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					props.onChange({ ...props.row, team: e.target.value });
				}}
			/>
		</td>
	</tr>
);

export default DrawInputTableRow;
