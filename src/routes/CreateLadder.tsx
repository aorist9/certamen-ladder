import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NumberInput from "../components/NumberInput";
import { DrawType, LadderStyle } from "../constants";
import ladderService from "../services/ladderService";
import { Ladder } from "../types/LadderType";
import features from "../features.json";
import Teams from "../types/Teams";

const CreateLadder = () => {
	const [name, setName] = useState<string>("");
	const [divisions, setDivisions] = useState<number | undefined>();
	const [type, setType] = useState<keyof typeof LadderStyle>("TRADITIONAL");
	const [rounds, setRounds] = useState<number | undefined>(3);
	const [draw, setDraw] = useState<DrawType | undefined>();
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		const err = isFormValid();
		if (typeof err === "string") {
			setError(err);
		} else {
			setError("");
			const ladderId = uuid();
			const newLadder: Ladder = new Ladder({
				id: ladderId,
				drawType: draw || DrawType.CLICK,
				name,
				numRounds: rounds || 3,
				ladderType: LadderStyle[type]
			});

			if (divisions) {
				newLadder.divisions = [] as { teams: Teams }[];
				for (let i = 0; i < divisions; i++) {
					newLadder.divisions.push({ teams: {} });
				}
			} else {
				newLadder.divisions = [{ teams: {} }];
			}

			ladderService.addLadder(newLadder);
			navigate(`/draw?ladder=${ladderId}`);
		}
	};

	const isFormValid = useCallback(() => {
		if (!name || name.trim() === "") {
			return "Name is Required";
		}
		if (!rounds || isNaN(rounds)) {
			return "Rounds are required";
		}
		if (draw === undefined) {
			return "Could you answer those questions about the draw for me, bud?";
		}

		return true;
	}, [name, rounds, draw]);

	return (
		<section className="App-page create-ladder">
			<header>
				<h2>Create a New Ladder</h2>
			</header>
			<form onSubmit={onSubmit}>
				<section className="form-field">
					<label htmlFor="ladder-name">Ladder Name:</label>
					<input
						type="text"
						id="ladder-name"
						style={{ minWidth: "20rem" }}
						placeholder="The name you can find this ladder under later"
						value={name}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setName(e.target.value)
						}
					/>
				</section>
				{features.multipleDivisions ? (
					<>
						<section className="form-field">
							<label>
								<input
									id="are-there-divisions"
									type="checkbox"
									checked={divisions !== undefined}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setDivisions(e.target.checked ? 3 : undefined)
									}
								/>
								Multiple Division Tournament
							</label>
						</section>
						{divisions !== undefined ? (
							<NumberInput
								id="divisions"
								label="How many divisions are there?"
								value={divisions}
								setValue={(value: number | undefined) => setDivisions(value)}
							/>
						) : (
							""
						)}
					</>
				) : (
					""
				)}
				{features.swissLadder || features.pointsSwissLadder ? (
					<section className="form-field">
						<label htmlFor="ladder-type">
							What type of ladder would you like to create?
						</label>
						<select
							id="ladder-type"
							value={type}
							onChange={(e: ChangeEvent<HTMLSelectElement>) =>
								setType(e.target.value as keyof typeof LadderStyle)
							}
						>
							{Object.keys(LadderStyle)
								.filter(
									key =>
										(features.swissLadder || type !== "SWISS") &&
										(features.pointsSwissLadder || type !== "SWISS_BY_POINTS")
								)
								.map(key => (
									<option key={key} value={key}>
										{LadderStyle[key as keyof typeof LadderStyle]}
									</option>
								))}
						</select>
					</section>
				) : (
					""
				)}
				{features.chooseRounds ||
				(features.swissLadder && type === "SWISS") ||
				(features.pointsSwissLadder && type === "SWISS_BY_POINTS") ? (
					<NumberInput
						id="rounds"
						value={rounds}
						setValue={value => setRounds(value)}
						label="How many preliminary rounds are you playing?"
					/>
				) : (
					""
				)}
				<section className="form-field">
					<label htmlFor="draw-type-radio-group">
						How would you like to do the draw?
					</label>
					<section
						id="draw-type-radio-group"
						className="radio-group"
						style={{ marginTop: ".3rem" }}
					>
						{Object.keys(DrawType).map(key => (
							<label key={key} className="radio-button">
								<input
									type="radio"
									name="draw-type"
									value={key}
									checked={DrawType[key as keyof typeof DrawType] === draw}
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										setDraw(DrawType[e.target.value as keyof typeof DrawType]);
									}}
								/>
								{DrawType[key as keyof typeof DrawType]}
							</label>
						))}
					</section>
				</section>
				<section style={{ display: "flex" }}>
					<button
						className="btn-success"
						type="submit"
						disabled={isFormValid() !== true}
					>
						Start
					</button>
					<p className="error">{error}</p>
				</section>
			</form>
		</section>
	);
};

export default CreateLadder;
