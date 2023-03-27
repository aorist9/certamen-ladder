import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Sidebar from "./components/Sidebar";
import CreateLadder from "./routes/CreateLadder";
import ViewLadders from "./routes/ViewLadders";
import Draw from "./routes/Draw";
import LadderDisplay from "./routes/LadderDisplay";
import "./App.css";

function App() {
	console.log(process.env.PUBLIC_URL);
	return (
		<main className="App">
			<header className="App-header">
				<h1>Certamen Ladder</h1>
			</header>
			<HashRouter basename={process.env.PUBLIC_URL}>
				<section style={{ display: "flex" }}>
					<Sidebar />
					<article style={{ flexGrow: 3 }}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/create" element={<CreateLadder />} />
							<Route path="/draw" element={<Draw />} />
							<Route path="/ladder" element={<LadderDisplay />} />
							<Route path="/ladders" element={<ViewLadders />} />
						</Routes>
					</article>
				</section>
			</HashRouter>
		</main>
	);
}

export default App;
