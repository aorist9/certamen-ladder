import React, { ChangeEvent } from 'react';

type NumberInputProps = {
	id: string;
	label: string;
	value: number | undefined;
	setValue: (value: number | undefined) => void;
};

const NumberInput = (props: NumberInputProps) => (
	<section className="form-field">
		<label htmlFor={props.id}>{props.label}</label>
		<input
			type="number"
			id={props.id}
			value={props.value || ''}
			onChange={(e: ChangeEvent<HTMLInputElement>) => {
				let val = parseInt(e.target.value);
				props.setValue(isNaN(val) ? undefined : val);
			}}
		/>
	</section>
);

export default NumberInput;
