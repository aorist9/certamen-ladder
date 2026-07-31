import React, { useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const BonusCheckboxSection = ({
	done
}: {
	done: (boni: boolean[]) => void;
}) => {
	const [bonus1, setBonus1] = useState(false);
	const [bonus2, setBonus2] = useState(false);

	return (
		<Stack
			direction="column"
			className="bonus-checkbox-section"
			sx={{ marginBottom: "1em", gap: "0.5em", alignItems: "center" }}
		>
			<FormControlLabel
				className="bonus-checkbox-label"
				control={
					<Checkbox
						name="bonus1"
						checked={bonus1}
						onClick={() => setBonus1(!bonus1)}
						className="bonus-checkbox"
					/>
				}
				label="Bonus 1"
			/>
			<FormControlLabel
				className="bonus-checkbox-label"
				control={
					<Checkbox
						name="bonus2"
						checked={bonus2}
						onClick={() => setBonus2(!bonus2)}
						className="bonus-checkbox"
					/>
				}
				label="Bonus 2"
			/>
			<Typography variant="body1">
				{10 + (bonus1 ? 5 : 0) + (bonus2 ? 5 : 0)} Points
			</Typography>
			<Button variant="contained" onClick={() => done([bonus1, bonus2])}>
				Done
			</Button>
		</Stack>
	);
};

export default BonusCheckboxSection;
