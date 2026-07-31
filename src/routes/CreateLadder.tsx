import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NumberInput from "../components/NumberInput";
import { DrawType, LadderStyle } from "../constants";
import ladderService from "../services/ladderService";
import { Ladder } from "../types/LadderType";
import Teams from "../types/Teams";
import { useFeatureFlags } from "../contexts/featureFlagsContext";

const CreateLadder = () => {
	const {
		multipleDivisions: multipleDivisionsFlag,
		swissLadder: swissLadderFlag,
		pointsSwissLadder: pointsSwissLadderFlag,
		chooseRounds: chooseRoundsFlag
	} = useFeatureFlags();

	const [name, setName] = useState<string>("");
	const [divisions, setDivisions] = useState<number | undefined>();
	const [type, setType] = useState<keyof typeof LadderStyle>("TRADITIONAL");
	const [rounds, setRounds] = useState<number | undefined>(3);
	const [draw, setDraw] = useState<DrawType | undefined>();
	const [messageText, setMessageText] = useState<string>("");
	const [messageShowUntil, setMessageShowUntil] = useState<
		"ALWAYS" | "DRAW" | "IN_PROGRESS" | "DONE" | ""
	>("");
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const theme = useTheme();

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

			if (messageText?.length) {
				newLadder.message = {
					text: messageText,
					showUntil: messageShowUntil || "ALWAYS"
				};
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
		<Box component="section" sx={{ display: "grid", gap: 3 }}>
			<Paper
				elevation={0}
				sx={{
					[theme.breakpoints.down("md")]: {
						px: 3,
						pt: 3,
						pb: 5,
						bgcolor: "background.paper",
						mb: 10
					},
					[theme.breakpoints.up("md")]: {
						p: 4,
						bgcolor: "background.paper"
					}
				}}
			>
				<Typography variant="h4" gutterBottom>
					Create a New Ladder
				</Typography>
				<Box
					component="form"
					onSubmit={onSubmit}
					sx={{ display: "grid", gap: 3 }}
				>
					<TextField
						id="ladder-name"
						label="Ladder Name:"
						variant="standard"
						placeholder="The name you can find this ladder under later"
						value={name}
						fullWidth
						sx={{ maxWidth: 520 }}
						onPointerDown={e => e.stopPropagation()}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setName(e.target.value)
						}
					/>

					{multipleDivisionsFlag ? (
						<Stack spacing={2}>
							<FormControlLabel
								control={
									<Checkbox
										checked={divisions !== undefined}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setDivisions(e.target.checked ? 3 : undefined)
										}
										onPointerDown={e => e.stopPropagation()}
									/>
								}
								label="Multiple Division Tournament"
							/>
							{divisions !== undefined ? (
								<Box component="section" sx={{ maxWidth: "300px" }}>
									<NumberInput
										id="divisions"
										label="How many divisions are there?"
										value={divisions}
										onValueChange={(value: number | null) =>
											value && setDivisions(value)
										}
										onPointerDown={e => e.stopPropagation()}
									/>
								</Box>
							) : null}
						</Stack>
					) : null}

					{swissLadderFlag || pointsSwissLadderFlag ? (
						<FormControl sx={{ maxWidth: 520 }}>
							<FormLabel htmlFor="ladder-type">
								What type of ladder would you like to create?
							</FormLabel>
							<Select
								id="ladder-type"
								value={type}
								onChange={e =>
									setType(e.target.value as keyof typeof LadderStyle)
								}
								onPointerDown={e => e.stopPropagation()}
							>
								{Object.keys(LadderStyle)
									.filter(
										type =>
											(swissLadderFlag || type !== "SWISS") &&
											(pointsSwissLadderFlag || type !== "SWISS_BY_POINTS")
									)
									.map(key => (
										<MenuItem
											key={key}
											value={key}
											onPointerDown={e => e.stopPropagation()}
										>
											{LadderStyle[key as keyof typeof LadderStyle]}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					) : null}

					{chooseRoundsFlag ||
					(swissLadderFlag && type === "SWISS") ||
					(pointsSwissLadderFlag && type === "SWISS_BY_POINTS") ? (
						<Box component="section" sx={{ maxWidth: "300px" }}>
							<NumberInput
								id="rounds"
								value={rounds}
								onValueChange={value => value && setRounds(value)}
								label="How many preliminary rounds are you playing?"
								onPointerDown={e => e.stopPropagation()}
							/>
						</Box>
					) : null}

					<FormControl sx={{ maxWidth: 720 }}>
						<FormLabel id="draw-type-radio-group">
							How would you like to do the draw?
						</FormLabel>
						<RadioGroup
							aria-labelledby="draw-type-radio-group"
							value={draw ?? ""}
						>
							{Object.keys(DrawType).map(key => (
								<FormControlLabel
									key={key}
									value={key}
									control={
										<Radio
											checked={draw === DrawType[key as keyof typeof DrawType]}
										/>
									}
									label={DrawType[key as keyof typeof DrawType]}
									onChange={() => {
										setDraw(DrawType[key as keyof typeof DrawType]);
									}}
									onPointerDown={e => e.stopPropagation()}
								/>
							))}
						</RadioGroup>
					</FormControl>

					<TextField
						id="ladder-message-text"
						label="Optional message for the ladder"
						placeholder="A message to display on the ladder page"
						value={messageText}
						fullWidth
						sx={{ maxWidth: 720 }}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setMessageText(e.target.value)
						}
						onPointerDown={e => e.stopPropagation()}
					/>

					<FormControl sx={{ maxWidth: 520 }}>
						<FormLabel htmlFor="ladder-message-show-until">
							This message should be shown until...
						</FormLabel>
						<Select
							id="ladder-message-show-until"
							value={messageShowUntil}
							onChange={e => {
								const nextValue = e.target.value as
									"ALWAYS" | "DRAW" | "IN_PROGRESS" | "DONE" | "";
								setMessageShowUntil(nextValue);
								if (!nextValue.length) {
									setMessageText("");
								}
							}}
							onPointerDown={e => e.stopPropagation()}
						>
							<MenuItem value="" onPointerDown={e => e.stopPropagation()}>
								None
							</MenuItem>
							<MenuItem value="ALWAYS" onPointerDown={e => e.stopPropagation()}>
								Always
							</MenuItem>
							<MenuItem value="DRAW" onPointerDown={e => e.stopPropagation()}>
								After the Draw
							</MenuItem>
							<MenuItem
								value="IN_PROGRESS"
								onPointerDown={e => e.stopPropagation()}
							>
								The rounds start (only works if you enter scores)
							</MenuItem>
							<MenuItem value="DONE" onPointerDown={e => e.stopPropagation()}>
								Done (only works if you enter scores)
							</MenuItem>
						</Select>
					</FormControl>

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
							flexWrap: "wrap"
						}}
					>
						<Button
							variant="contained"
							type="submit"
							disabled={isFormValid() !== true}
						>
							Start
						</Button>
						{error ? (
							<Alert
								severity="error"
								sx={{ flex: 1, border: 1, borderColor: "divider" }}
							>
								{error}
							</Alert>
						) : null}
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

export default CreateLadder;
