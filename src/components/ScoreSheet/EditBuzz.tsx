import { ChangeEvent } from "react";

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
		<div style={{ display: "flex", gap: "1em", fontSize: "x-large" }}>
			<label id={label.toLowerCase().replace(" ", "")}>{label}:</label>
			<select
				name={label.toLowerCase().replace(" ", "")}
				className="buzz-dropdown"
				value={value}
				onChange={(e: ChangeEvent<HTMLSelectElement>) =>
					setValue(e.target.value === "" ? undefined : e.target.value)
				}
			>
				<option value=""></option>
				{values.map(buzzer => (
					<option key={buzzer} value={buzzer}>
						{buzzer}
					</option>
				))}
			</select>
			<span>
				<input
					type="checkbox"
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
				<label
					htmlFor={label.replace("Buzz ", "correct")}
					style={{ paddingLeft: "0.25em" }}
				>
					Correct
				</label>
			</span>
		</div>
	);
};

export default EditBuzz;
