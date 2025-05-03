import { Link, useSearchParams } from "react-router-dom";
import Scoreboard from "../components/Scoreboard";
import "./ScoreboardPage.css";
import { useLadder } from "../services/ladderService";

const ScoreboardPage = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const publicId: string | null = useSearchParams()[0].get("publicId");
	const { ladder } = useLadder({ ladderId, publicLadderId: publicId });

	const header = (
		<section style={{ display: "flex", columnGap: "2em" }}>
			<h2>{ladder?.name}</h2>
			<Link
				to={`/ladder?${
					ladderId ? `ladder=${ladderId}` : `publicId=${publicId}`
				}`}
				style={{ margin: "auto 0" }}
				className="hide-print"
			>
				Ladder
			</Link>
		</section>
	);

	if (
		ladder?.divisions?.length &&
		ladder.divisions?.some(d => d.matches?.length)
	) {
		return (
			<section className="App-page scoreboard">
				{header}
				<section
					style={{ display: "flex", flexWrap: "wrap", columnGap: "1em" }}
				>
					{ladder.divisions.map((d, idx) => (
						<Scoreboard
							key={d.division}
							name={d.division}
							ladder={ladder}
							divisionNumber={idx}
						/>
					))}
				</section>
			</section>
		);
	} else {
		return (
			<section className="App-page scoreboard">
				"You may have reached this page in error"
			</section>
		);
	}
};

export default ScoreboardPage;
