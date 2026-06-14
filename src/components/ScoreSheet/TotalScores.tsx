import React from "react";
import { useRoundContext } from "../../contexts/RoundContext";
import { LETTERS } from "../../types/Round";
import { NOT_A_TEAM } from "../../constants";

const TotalScores = () => {
	const { scores, teams } = useRoundContext();
	return (
		<section className="total-scores">
			{scores.map((score, idx) => teams[idx].name === NOT_A_TEAM.name ? (
        ""
      ) : (
				<section className="team-total-score" key={idx}>
					<span className="letter">{LETTERS[idx]}</span>
					<span className="score">{score}</span>
				</section>
			))}
		</section>
	);
};

export default TotalScores;
