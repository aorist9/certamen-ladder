import React, { ChangeEvent } from "react";

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
			<input
				id={`letter-${props.idx}`}
				type="text"
				style={{ maxWidth: "4em" }}
				value={props.row.letter || ""}
				data-testid="letter-input"
				aria-describedby="letter-header"
				aria-labelledby="letter-header"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					props.onChange({ ...props.row, letter: e.target.value });
				}}
			/>
		</td>
		<td>
			<input
				id={`team-${props.idx}`}
				type="text"
				value={props.row.team || ""}
				data-testid="team-input"
				aria-describedby="team-header"
				aria-labelledby="team-header"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					props.onChange({ ...props.row, team: e.target.value });
				}}
			/>
		</td>
	</tr>
);

export default DrawInputTableRow;
