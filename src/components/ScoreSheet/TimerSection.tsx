import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const TimerSection = () => {
	const [timer, setTimer] = useState(0);
	const [timerOn, setTimerOn] = useState(false);

	useEffect(() => {
		if (timerOn) {
			const timeout = setTimeout(() => {
				setTimer(timer > 0 ? timer - 1 : 0);
			}, 1000);
			return () => clearTimeout(timeout);
		}
	}, [timer, timerOn]);

	return (
		<Stack
			direction="column"
			className="timer-section"
			sx={{
				marginRight: "1em",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: "1em"
			}}
		>
			{timerOn ? (
				<>
					<Typography
						variant="h4"
						sx={{ margin: "1em", fontSize: timer > 0 ? "24pt" : "20pt" }}
					>
						{timer > 0 ? timer : "Time's up!"}
					</Typography>
					<Button
						variant="contained"
						color="error"
						sx={{ fontSize: "14pt", padding: "1em" }}
						onClick={() => {
							setTimer(0);
							setTimerOn(false);
						}}
					>
						Stop Timer
					</Button>
				</>
			) : (
				<Button
					className="btn-success"
					variant="contained"
					color="success"
					style={{ fontSize: "14pt", padding: "1em" }}
					onClick={() => {
						setTimer(15);
						setTimerOn(true);
					}}
				>
					Start Timer
				</Button>
			)}
		</Stack>
	);
};

export default TimerSection;
