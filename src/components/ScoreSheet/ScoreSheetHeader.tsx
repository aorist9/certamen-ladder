import React from "react";
import { Link } from "react-router-dom";
import { useRoundContext } from "../../contexts/RoundContext";

const ScoreSheetHeader: React.FC<{
	ladderId?: string | null;
	publicId?: string | null;
}> = ({ ladderId, publicId }) => {
	const { isEditMode, setIsEditMode } = useRoundContext();
	return (
		<header className="score-sheet-header">
			<h2>Code Sheet</h2>
			<label
				htmlFor="edit-mode"
				className="do-not-print"
				onClick={() => setIsEditMode(!isEditMode)}
			>
				<input
					type="checkbox"
					name="edit-mode"
					id="edit-mode"
					checked={isEditMode}
				/>
				&nbsp; Edit Mode
			</label>
			<Link
				className="do-not-print"
				to={`/ladder?${
					ladderId ? `ladder=${ladderId}` : `publicId=${publicId}`
				}`}
			>
				Return to Ladder
			</Link>
		</header>
	);
};

export default ScoreSheetHeader;
