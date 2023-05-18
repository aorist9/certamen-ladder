const DataDisplay = (props: { description: string; value: string }) => (
	<section className="data-display">
		<section className="description">{props.description}</section>
		<section className="data-field">{props.value}</section>
	</section>
);

export default DataDisplay;
