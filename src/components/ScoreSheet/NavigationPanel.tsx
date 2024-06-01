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
			<button
				className="btn-info question-nav-button"
				disabled={currentQuestion === 0}
				onClick={previousQuestion}
			>
				{LEFT_ARROW}
			</button>
			<button
				className="btn-info question-nav-button"
				disabled={currentQuestion >= 19}
				onClick={nextQuestion}
			>
				{RIGHT_ARROW}
			</button>
		</section>
		<section style={{ display: "flex", justifyContent: "center" }}>
			<button
				onClick={setEditing}
				style={{
					paddingLeft: "1em",
					paddingRight: "1em",
					fontSize: "13pt"
				}}
			>
				Edit
			</button>
		</section>
	</section>
);

export default NavigationPanel;
