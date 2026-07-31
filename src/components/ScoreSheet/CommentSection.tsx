import React from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const CommentSection = ({
	comment,
	setComment
}: {
	comment: string | undefined;
	setComment: (comment: string) => void;
}) => {
	return (
		<Box sx={{ my: "1rem" }}>
			<FormControlLabel
				label="Comments"
				labelPlacement="start"
				control={
					<TextareaAutosize
						name="comments"
						minRows={2}
						placeholder="Comments"
						value={comment || ""}
						style={{ minWidth: "375px" }}
						onChange={e => setComment(e.target.value)}
					/>
				}
			/>
		</Box>
	);
};

export default CommentSection;
