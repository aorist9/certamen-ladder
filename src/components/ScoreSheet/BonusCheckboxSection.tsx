import React, { useState } from "react";

const BonusCheckboxSection = ({
	done
}: {
	done: (boni: boolean[]) => void;
}) => {
	const [bonus1, setBonus1] = useState(false);
	const [bonus2, setBonus2] = useState(false);

	return (
		<section className="bonus-checkbox-section" style={{ marginBottom: "1em" }}>
			<p>
				<label
					htmlFor="bonus1"
					onClick={() => setBonus1(!bonus1)}
					className="bonus-checkbox-label"
				>
					<input
						type="checkbox"
						name="bonus1"
						checked={bonus1}
						className="bonus-checkbox"
					/>
					&nbsp; Bonus 1
				</label>
			</p>
			<p>
				<label
					htmlFor="bonus2"
					onClick={() => setBonus2(!bonus2)}
					className="bonus-checkbox-label"
				>
					<input
						type="checkbox"
						name="bonus2"
						checked={bonus2}
						className="bonus-checkbox"
					/>
					&nbsp; Bonus 2
				</label>
			</p>
			<p>{10 + (bonus1 ? 5 : 0) + (bonus2 ? 5 : 0)} Points</p>
			<button
				style={{ fontSize: "14pt", padding: "0.25em 0.5em" }}
				onClick={() => done([bonus1, bonus2])}
			>
				Done
			</button>
		</section>
	);
};

export default BonusCheckboxSection;
