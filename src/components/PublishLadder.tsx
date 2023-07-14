import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";

const PublishLadder = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const [loading, setLoading] = useState<boolean>(false);
	const ladder: LadderType | undefined = useMemo(
		() => (ladderId ? ladderService.getLadder(ladderId) : undefined),
		[ladderId]
	);
	if (loading) {
		return <section>Processing...</section>;
	} else if (ladder?.publicId) {
		return (
			<section>
				<h2>Your ladder is public</h2>
				<a
					href={`${window.location.href.substring(
						0,
						window.location.href.indexOf("/certamen-ladder")
					)}/certamen-ladder#/ladder?publicId=${ladder.publicId}`}
				>
					Public Link
				</a>
			</section>
		);
	} else if (ladder) {
		return (
			<button
				style={{ fontSize: "1.4rem", marginTop: "1em" }}
				onClick={() => {
					setLoading(true);
					ladderService
						.publishLadder(ladder)
						.then(newLadder => {
							setLoading(false);
							window.location.reload();
						})
						.catch(error => {
							setLoading(false);
						});
				}}
			>
				Publish this Ladder
			</button>
		);
	} else {
		return <></>;
	}
};

export default PublishLadder;
