import React, { useEffect, useState } from "react";

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
		<section
			className="timer-section"
			style={{
				marginRight: "1em",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: "1em"
			}}
		>
			{timerOn ? (
				<>
					<section
						style={{
							margin: "1em",
							fontSize: timer > 0 ? "24pt" : "20pt"
						}}
					>
						{timer > 0 ? timer : "Time's up!"}
					</section>
					<button
						className="btn-danger"
						style={{ fontSize: "14pt", padding: "1em" }}
						onClick={() => {
							setTimer(0);
							setTimerOn(false);
						}}
					>
						Stop Timer
					</button>
				</>
			) : (
				<button
					className="btn-success"
					style={{ fontSize: "14pt", padding: "1em" }}
					onClick={() => {
						setTimer(15);
						setTimerOn(true);
					}}
				>
					Start Timer
				</button>
			)}
		</section>
	);
};

export default TimerSection;
