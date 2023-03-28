import React, { useMemo } from "react";
import LadderType from "../types/LadderType";
import pittingService from "../services/pittingService";

type DisplayedLadderProps = {
	ladder: LadderType;
	name?: string;
};

const DisplayedLadder = (props: DisplayedLadderProps) => {
	const pittings: string[][][] = useMemo(
		() => pittingService.generateInitialPittings(props.ladder),
		[props.ladder]
	);

	if (props.ladder && pittings && pittings.length) {
		return (
			<section className="displayed-ladder">
				{props.name ? <h3>{props.name}</h3> : ""}
				<table>
					<thead>
						<tr>
							{pittings.map((_, i: number) => (
								<th key={i}>Round {i + 1}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{pittings[0].map((_, i: number) => (
							<tr key={i}>
								{pittings.map((_, j: number) => (
									<td key={`${j}:${i}`} data-testid={`round-${j + 1}`}>
										<ul>
											{pittings[j][i].map((team: string) => (
												<li key={team}>{team}</li>
											))}
										</ul>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</section>
		);
	} else {
		return <></>;
	}
};

export default DisplayedLadder;
