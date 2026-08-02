import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DrawProps } from "../../routes/Draw";
import DrawInputTableRow, { DrawRow } from "./DrawInputTableRow";
import { useMemo } from "react";

const mapTeamsToObject = (rows: DrawRow[]): { [letter: string]: string } => {
	return rows.reduce((acc: { [letter: string]: string }, row) => {
		if (row.letter && row?.letter?.trim() && row?.team?.trim()) {
			acc[row.letter] = row.team;
		}
		return acc;
	}, {});
};

const OldFashionedDraw = (props: DrawProps) => {
	const { teams } = props;
	const defaultRows = useMemo(() => {
		const defaultRows = teams
			? Object.keys(teams).map(letter => ({
					letter,
					team: teams?.[letter] as string
				}))
			: [];
		const targetLength = defaultRows.length < 12 ? 12 : defaultRows.length + 3;
		while (defaultRows.length < targetLength) {
			defaultRows.push({ letter: "", team: "" });
		}
		return defaultRows;
	}, [teams]);
	const [rows, setRows] = useState<DrawRow[]>(defaultRows);

	const activeRows: number = useMemo<number>(
		() =>
			rows.reduce((acc, row) => (row.letter && row.team ? acc + 1 : acc), 0),
		[rows]
	);

	useEffect(() => {
		props.setDrawFunction(() => mapTeamsToObject(rows));
		// eslint-disable-next-line
	}, [rows]);

	return (
		<Box component="section" sx={{ display: "grid", gap: 2 }}>
			<Typography variant="body1">
				Please enter the teams as they draw. Don't worry about putting them in
				order or filling up all the fields.
			</Typography>
			<Stack spacing={2}>
				<Box>
					<table className="input-table">
						<thead>
							<tr>
								<th id="letter-header">Letter</th>
								<th id="team-header">Team Name</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, i) => (
								<DrawInputTableRow
									key={i}
									idx={i}
									row={row}
									onChange={(value: DrawRow) => {
										setRows([...rows.slice(0, i), value, ...rows.slice(i + 1)]);
									}}
								/>
							))}
						</tbody>
					</table>
					<Button
						variant="contained"
						sx={{ mt: 1.5 }}
						onClick={() => setRows([...rows, {}, {}, {}, {}, {}, {}])}
					>
						+ Add More Teams
					</Button>
				</Box>
				{activeRows === 6 && (
					<FormControlLabel
						control={
							<Checkbox
								id="three-rooms-for-six-teams"
								checked={props.threeRooms}
								onChange={e => props.setThreeRooms(e.target.checked)}
							/>
						}
						label="Separate these six teams into 3 rooms?"
					/>
				)}
			</Stack>
		</Box>
	);
};

export default OldFashionedDraw;
