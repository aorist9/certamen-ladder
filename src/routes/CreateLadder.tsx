import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NumberInput from "../components/NumberInput";
import { drawTypes, ladderTypes } from "../constants";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import features from "../features.json";

const CreateLadder = () => {
	const [name, setName] = useState<string>("");
	const [divisions, setDivisions] = useState<number | undefined>();
	const [type, setType] = useState<number>(0);
	const [rounds, setRounds] = useState<number | undefined>(3);
	const [draw, setDraw] = useState<number | undefined>();
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
			const newLadder: LadderType = {
				id: ladderId,
				draw: draw || 0,
				name,
				rounds: rounds || 3,
				type
			};

			if (divisions) {
				newLadder.divisions = divisions;
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
		if (draw === undefined || isNaN(draw)) {
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
								setType(parseInt(e.target.value))
							}
						>
							{ladderTypes
								.filter(
									type =>
										(features.swissLadder || type !== "Swiss") &&
										(features.pointsSwissLadder || type !== "Swiss by Points")
								)
								.map((type, i) => (
									<option key={i} value={i}>
										{type}
									</option>
								))}
						</select>
					</section>
				) : (
					""
				)}
				{features.chooseRounds || (features.swissLadder && type === 1) ? (
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
						{drawTypes.map((drawType, i) => (
							<label key={i} className="radio-button">
								<input
									type="radio"
									name="draw-type"
									value={i}
									checked={i === draw}
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										setDraw(parseInt(e.target.value));
									}}
								/>
								{drawType}
							</label>
						))}
					</section>
				</section>
				<section style={{ display: "flex" }}>
					<button type="submit" disabled={isFormValid() !== true}>
						Start
					</button>
					<p className="error">{error}</p>
				</section>
			</form>
		</section>
	);
};

export default CreateLadder;
