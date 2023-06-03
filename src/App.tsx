import React, { useEffect, useRef, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Sidebar from "./components/Sidebar";
import CreateLadder from "./routes/CreateLadder";
import ViewLadders from "./routes/ViewLadders";
import Draw from "./routes/Draw";
import LadderDisplay from "./routes/LadderDisplay";
import ScoreboardPage from "./routes/ScoreboardPage";
import "./App.css";
import HamburgerIcon from "./icons/Hamburger";

function App() {
	const headerRef = useRef<HTMLHeadingElement>(null);
	const [height, setHeight] = useState<number>(0);
	const [showSidebar, setShowSidebar] = useState<boolean>(false);

	useEffect(() => {
		if (headerRef.current) {
			setHeight(headerRef.current.clientHeight);
		}
	}, [headerRef, setHeight]);

	return (
		<main className="App">
			<header className="App-header" ref={headerRef}>
				<h1 style={{ display: "flex" }}>
					<button
						className="menu-btn mobile-only"
						style={{ margin: "0.5em 1em" }}
						onClick={() => setShowSidebar(!showSidebar)}
					>
						<HamburgerIcon color="white" />
					</button>
					Certamen Ladder
				</h1>
			</header>
			<div className="mobile-only" style={{ height: `${height}px` }}></div>
			<HashRouter>
				<section style={{ display: "flex" }}>
					<Sidebar visible={showSidebar} />
					<article
						style={{ flexGrow: 3 }}
						onClick={() => setShowSidebar(false)}
					>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/create" element={<CreateLadder />} />
							<Route path="/draw" element={<Draw />} />
							<Route path="/ladder" element={<LadderDisplay />} />
							<Route path="/ladders" element={<ViewLadders />} />
							<Route path="/scoreboard" element={<ScoreboardPage />} />
						</Routes>
					</article>
				</section>
			</HashRouter>
		</main>
	);
}

export default App;
