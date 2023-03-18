import React from "react";
import features from "../features.json";
import "./Home.css";

const Home = () => (
	<section className="App-page home">
		<p>
			Welcome to Certamen Ladder. Check the sidebar to create ladders or view
			ladders that you previously created.
		</p>
		<h2>About this Tool</h2>
		<p>
			Although Certamen Ladder is on the web and runs on your browser, the data
			you put in doesn't go anywhere but is stored on your computer. The good
			news is that no one can see the information you put in; the bad news is
			that no one can see the information you put in. Ladders will be designed
			to be printed out for sharing purposes, but as of now there's no way to
			share your ladder via this app.
		</p>
		{features.swissLadder ? (
			<>
				<h2>About the Swiss System</h2>
				<p>
					When creating a ladder you'll be offered the opportunity to use Swiss
					seeding TODO
				</p>
			</>
		) : (
			""
		)}
	</section>
);

export default Home;
