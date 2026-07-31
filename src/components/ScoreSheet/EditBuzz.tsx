import { ChangeEvent } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

const EditBuzz = ({
	clearCorrect,
	isCorrect,
	label,
	setCorrect,
	setValue,
	value = "",
	values
}: {
	clearCorrect: VoidFunction;
	isCorrect?: boolean;
	label: string;
	setCorrect: VoidFunction;
	setValue: (value: string | undefined) => void;
	value?: string;
	values: string[];
}) => {
	return (
		<Stack direction="row" sx={{ gap: "1em", fontSize: "x-large" }}>
			<InputLabel
				htmlFor={label.toLowerCase().replace(" ", "")}
				sx={{ fontSize: "inherit" }}
				id={label.toLowerCase().replace(" ", "")}
				component="label"
			>
				{label}
			</InputLabel>
			<Select
				name={label.toLowerCase().replace(" ", "")}
				className="buzz-dropdown"
				variant="standard"
				value={value}
				onChange={e =>
					setValue(e.target.value === "" ? undefined : e.target.value)
				}
				sx={{ minWidth: "5em" }}
			>
				<MenuItem value=""></MenuItem>
				{values.map(buzzer => (
					<MenuItem key={buzzer} value={buzzer}>
						{buzzer}
					</MenuItem>
				))}
			</Select>
			<span>
				<FormControlLabel
					control={
						<Checkbox
							id={label.replace("Buzz ", "correct")}
							checked={isCorrect}
							className="correct-checkbox"
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								if (isCorrect) {
									clearCorrect();
								} else {
									setCorrect();
								}
							}}
						/>
					}
					label="Correct"
				/>
			</span>
		</Stack>
	);
};

export default EditBuzz;
