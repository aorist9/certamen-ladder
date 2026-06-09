import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EditingStatus } from "../components/DisplayLadder/DisplayedLadder";
import TeamDisplay from "../components/DisplayLadder/TeamDisplay";
import { useLadder } from "../services/ladderService";

const LadderRow = () => {
	const [query] = useSearchParams();
	const ladderId: string | null = query.get("ladder");
	const publicLadderId: string | null =
		query.get("publicLadderId") || query.get("publicId");
	const divisionNumber = parseInt(query.get("division") || "", 10);
	const roomNumber = parseInt(query.get("room") || "", 10);
	const { ladder } = useLadder({ ladderId, publicLadderId });

	const division = ladder?.divisions?.[divisionNumber];

	const roomCount = division?.matches?.[0]?.length ?? 0;
	const hasValidRoom =
		division !== undefined &&
		Number.isInteger(roomNumber) &&
		roomNumber >= 0 &&
		roomNumber < roomCount;

	const row = useMemo(
		() => (hasValidRoom ? division?.matches?.map(round => round[roomNumber]) : []),
		[division, hasValidRoom, roomNumber]
	);

	const ladderQuery = ladderId ? `ladder=${ladderId}` : publicLadderId ? `publicId=${publicLadderId}` : "";

	if (!ladder || !row || division === undefined || !hasValidRoom) {
		return (
			<section className="App-page ladder-display">
				<p>You may have reached this page in error</p>
			</section>
		);
	}

	return (
		<section className="App-page ladder-display">
			<section style={{ display: "flex", columnGap: "2em" }}>
				<h2>{ladder.name}</h2>
				<Link to={`/ladder?${ladderQuery}`} className="hide-print">
					Full Ladder
				</Link>
			</section>
			<section style={{ marginTop: "1em" }}>
				<h3>
					{division.division ?? ""} {division.rooms?.[roomNumber] ? <pre>{division.rooms?.[roomNumber]}</pre> : `Room ${roomNumber + 1}`}
				</h3>
			</section>
			<table>
				<thead>
					<tr>
						{division.matches?.map((_, roundIndex) => (
							<th key={roundIndex}>Round {roundIndex + 1}</th>
						))}
            {division.rooms?.[roomNumber] && <th>Room</th>}
					</tr>
				</thead>
				<tbody>
					<tr>
						{row.map((pitting, roundIndex) => (
							<td key={roundIndex}>
								<ul>
									{pitting?.teams.map((team, teamIdx) => (
										<TeamDisplay
											key={`${team.team}-${teamIdx}`}
											onScoreChange={() => undefined}
											roundEditStatus={EditingStatus.EDITED}
											score={team.score}
											swissPoints={team.swissPoints}
											team={team.team}
										/>
									))}
								</ul>
								{pitting?.scoresheetId ? (
                  <section className="score-sheet-link hide-print">
                    <Link
                      to={`/score-sheet?ladder=${query.get(
                        "ladder"
                      )}&round=${pitting.scoresheetId}`}
                      className="hide-print"
                    >
                      Score Sheet
                    </Link>
                  </section>
								) : null}
							</td>
						))}
            {division.rooms?.[roomNumber] && <td><pre>{division.rooms?.[roomNumber]}</pre></td>}
					</tr>
				</tbody>
			</table>
		</section>
	);
};

export default LadderRow;
