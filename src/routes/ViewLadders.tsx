import React, { useState } from "react";
import { Link } from "react-router-dom";
import ladderService from "../services/ladderService";
import LadderType from "../types/LadderType";
import LadderInfoSection from "../components/LadderInfoSection";
import "./ViewLadders.css";

const ViewLadders = () => {
	const [ladders, setLadders] = useState<LadderType[]>(
		ladderService.getLadders()
	);

	return (
		<section className="App-page view-ladders">
			<h2>Existing Ladders</h2>
			<p>Click one to see the ladder</p>
			<section className="list-of-ladders">
				{ladders.map((ladder: LadderType) => (
					<section className="ladder-item" key={ladder.id}>
						<Link
							to={`/${ladder.teams ? "ladder" : "draw"}?ladder=${ladder.id}`}
							style={{
								textDecoration: "inherit",
								color: "inherit"
							}}
						>
							<LadderInfoSection ladder={ladder} />
						</Link>
						<section className="delete-ladder-button-section">
							<button
								onClick={() => {
									ladderService.deleteLadder(ladder.id);
									setLadders(
										ladders.filter((l: LadderType) => l.id !== ladder.id)
									);
								}}
							>
								Delete
							</button>
						</section>
					</section>
				))}
			</section>
		</section>
	);
};

export default ViewLadders;
