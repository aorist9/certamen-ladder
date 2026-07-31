import Button from "@mui/material/Button";

const LEFT_ARROW = "\u2190";
const RIGHT_ARROW = "\u2192";

const NavigationPanel = ({
	setEditing,
	nextQuestion,
	previousQuestion,
	currentQuestion
}: {
	currentQuestion: number;
	nextQuestion: VoidFunction;
	previousQuestion: VoidFunction;
	setEditing: VoidFunction;
}) => (
	<section>
		<section>
			<Button
				variant="outlined"
				size="large"
				color="secondary"
				className="btn-info question-nav-button"
				disabled={currentQuestion === 0}
				onClick={previousQuestion}
			>
				{LEFT_ARROW}
			</Button>
			<Button
				variant="outlined"
				size="large"
				color="secondary"
				className="btn-info question-nav-button"
				disabled={currentQuestion >= 19}
				onClick={nextQuestion}
			>
				{RIGHT_ARROW}
			</Button>
		</section>
		<section style={{ display: "flex", justifyContent: "center" }}>
			<Button
				variant="contained"
				color="warning"
				onClick={setEditing}
				style={{
					paddingLeft: "1em",
					paddingRight: "1em",
					fontSize: "13pt"
				}}
			>
				Edit
			</Button>
		</section>
	</section>
);

export default NavigationPanel;
