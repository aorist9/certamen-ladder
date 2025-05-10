import React from "react";
import "./Home.css";
import { useFeatureFlags } from "../contexts/featureFlagsContext";

const Home = () => {
	const {
		publishLadder: publishLadderFlag,
		swissLadder: swissLadderFlag,
		pointsSwissLadder: pointsSwissLadderFlag,
		codeSheet: codeSheetFlag
	} = useFeatureFlags();
	return (
		<section className="App-page home">
			<p>
				Welcome to Certamen Ladder. Check the sidebar to create ladders or view
				ladders that you previously created.
			</p>
			<h2>About this Tool</h2>
			<p>
				Certamen Ladder allows you to create ladders for Certamen tournaments,
				including help doing the draw, setting the pittings, and keeping score.
			</p>
			{publishLadderFlag ? (
				<p>
					Ladders can now be made public to share via a link; watch the sidebar
					for the opportunity to publish your ladder. Even when a ladder is
					shared it can only be updated/edited from the computer that created
					it, which should keep others from changing your ladders.
				</p>
			) : (
				<p>
					Although Certamen Ladder is on the web and runs on your browser, the
					data you put in doesn't go anywhere but is stored on your computer.
					The good news is that no one can see the information you put in; the
					bad news is that no one can see the information you put in. Ladders
					will be designed to be printed out for sharing purposes, but as of now
					there's no way to share your ladder via this app.
				</p>
			)}
			{codeSheetFlag && (
				<>
					<h2>Score Sheets</h2>
					<p>
						You wanna keep score on the app? Good news, that is now available.
						You will see a scoresheet link for each round on the ladder, you
						will be able to send a link to someone who can then keep score on
						their phone or on a laptop, and the score will be automatically
						reflected on the ladder and scoreboard pages.
						<br />
						N.B. You should <i>either</i> set scores on the ladder page{" "}
						<i>or</i> use the scoresheet, since the scoresheet will repeatedly
						overwrite scores set from the ladder page.
					</p>
				</>
			)}
			{swissLadderFlag ? (
				<>
					<h2>About the Swiss System</h2>
					<p>
						When creating a ladder you'll be offered the opportunity to use
						Swiss seeding, which will provide you the pittings for the first
						round based on the draw and then determine the following rounds by
						pitting teams against each other based on their performance in
						previous rounds (pitting teams against others performing at the same
						level).
					</p>
					{pointsSwissLadderFlag && (
						<p>
							You will also see "Swiss by Points" as an option for type of
							ladder. This is an experimental ladder type where swiss points are
							assigned not on whether a team wins its particular round, but
							whether the team's score falls in the top, middle, or bottom third
							of all scores
						</p>
					)}
				</>
			) : (
				""
			)}
		</section>
	);
};

export default Home;
