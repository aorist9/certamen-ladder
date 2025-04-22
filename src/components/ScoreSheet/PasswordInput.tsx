import React, { useState } from "react";
import { useRoundContext } from "../../contexts/RoundContext";
import "./PasswordInput.css";

const PasswordInput: React.FC = () => {
	const [password, setLocalPassword] = useState("");
	const { setPassword } = useRoundContext();

	const handleSubmit = () => {
		setPassword(password);
	};

	return (
		<div className="password">
			<input
				type="password"
				className="password-input"
				value={password}
				onChange={e => setLocalPassword(e.target.value)}
				placeholder="Enter the password"
			/>
			<button onClick={handleSubmit}>Ok</button>
		</div>
	);
};

export default PasswordInput;
