import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ladderService from "../services/ladderService";
import { Ladder } from "../types/LadderType";
import QRCode from "react-qr-code";

const PublishLadder = () => {
	const ladderId: string | null = useSearchParams()[0].get("ladder");
	const [loading, setLoading] = useState<boolean>(false);
	const ladder: Ladder | undefined = useMemo(
		() => (ladderId ? ladderService.getLadder(ladderId) : undefined),
		[ladderId]
	);
	if (loading) {
		return <section>Processing...</section>;
	} else if (ladder?.publicId) {
		const href = `${window.location.href.substring(
			0,
			window.location.href.indexOf("/certamen-ladder")
		)}/certamen-ladder#/ladder?publicId=${ladder.publicId}`;
		return (
			<section
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					padding: "0 3em"
				}}
			>
				<h2>Your ladder is public</h2>
				<QRCode value={href} size={150} />
				<a href={href} style={{ margin: "0.5em 0" }}>
					Public Link
				</a>
			</section>
		);
	} else if (ladder) {
		return (
			<button
				style={{ fontSize: "1.4rem", marginTop: "1em", marginLeft: "0.5em" }}
				onClick={() => {
					setLoading(true);
					const lddr: Ladder | undefined = ladderService.getLadder(ladder.id);
					if (!lddr) {
						throw new Error("umm... there's no ladder");
					}
					ladderService
						.publishLadder(lddr)
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
