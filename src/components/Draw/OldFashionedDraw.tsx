import React, { useEffect, useState } from "react";
import { DrawProps } from "../../routes/Draw";
import DrawInputTableRow, { DrawRow } from "./DrawInputTableRow";

const mapTeamsToObject = (rows: DrawRow[]): { [letter: string]: string } => {
	return rows.reduce((acc: { [letter: string]: string }, row) => {
		if (row.letter && row?.letter?.trim() && row?.team?.trim()) {
			acc[row.letter] = row.team;
		}
		return acc;
	}, {});
};

const OldFashionedDraw = (props: DrawProps) => {
	const [rows, setRows] = useState<DrawRow[]>([
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{}
	]);

	useEffect(() => {
		props.setDrawFunction(() => mapTeamsToObject(rows));
		// eslint-disable-next-line
	}, [rows]);

	return (
		<section>
			<section>
				Please enter the teams as they draw. Don't worry about putting them in
				order or filling up all the fields.
			</section>
			<section className="teams">
				<section>
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
					<button onClick={() => setRows([...rows, {}, {}, {}, {}, {}, {}])}>
						+ Add More Teams
					</button>
				</section>
			</section>
		</section>
	);
};

export default OldFashionedDraw;
