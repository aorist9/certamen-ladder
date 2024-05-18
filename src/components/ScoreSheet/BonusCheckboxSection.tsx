import React, { useState } from "react";

const BonusCheckboxSection = () => {
	const [bonus1, setBonus1] = useState(false);
	const [bonus2, setBonus2] = useState(false);

	return (
		<section className="bonus-checkbox-section">
			<p>
				<label htmlFor="bonus1" onClick={() => setBonus1(!bonus1)}>
					<input type="checkbox" name="bonus1" checked={bonus1} />
					&nbsp; Bonus 1
				</label>
			</p>
			<p>
				<label htmlFor="bonus2" onClick={() => setBonus2(!bonus2)}>
					<input type="checkbox" name="bonus2" checked={bonus2} />
					&nbsp; Bonus 2
				</label>
			</p>
			<p>{10 + (bonus1 ? 5 : 0) + (bonus2 ? 5 : 0)} Points</p>
			<button>Done</button>
		</section>
	);
};

export default BonusCheckboxSection;
