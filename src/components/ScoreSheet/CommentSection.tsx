import React from "react";

const CommentSection = ({
	comment,
	setComment
}: {
	comment: string | undefined;
	setComment: (comment: string) => void;
}) => {
	return (
		<section style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
			<label htmlFor="comments">Comments</label>
			<textarea
				name="comments"
				placeholder="Comments"
				style={{ flexGrow: "1" }}
				value={comment || ""}
				onChange={e => setComment(e.target.value)}
			/>
		</section>
	);
};

export default CommentSection;
