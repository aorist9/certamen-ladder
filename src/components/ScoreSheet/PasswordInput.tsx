import React, { useEffect, useState } from "react";
import { useRoundContext } from "../../contexts/RoundContext";
import "./PasswordInput.css";

const PasswordInput: React.FC = () => {
	const [password, setLocalPassword] = useState("");
	const { setPassword } = useRoundContext();

	const handleSubmit = () => {
		setPassword(password);
	};

	useEffect(() => {
		document.getElementById("password-input")?.focus();
	}, []);

	return (
		<form onSubmit={handleSubmit}>
			<div className="password">
				<input
					type="password"
					className="password-input"
					id="password-input"
					value={password}
					onChange={e => setLocalPassword(e.target.value)}
					placeholder="Enter the password"
				/>
				<button type="submit">Ok</button>
			</div>
		</form>
	);
};

export default PasswordInput;
