import React from "react";
import { useRoundContext } from "../../contexts/RoundContext";
import { LETTERS } from "../../types/Round";

const TotalScores = () => {
	const { scores } = useRoundContext();
	return (
		<section className="total-scores">
			{scores.map((score, idx) => (
				<section className="team-total-score" key={idx}>
					<span className="letter">{LETTERS[idx]}</span>
					<span className="score">{score}</span>
				</section>
			))}
		</section>
	);
};

export default TotalScores;
