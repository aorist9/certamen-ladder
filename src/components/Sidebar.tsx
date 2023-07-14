import React from "react";
import { Link } from "react-router-dom";
import features from "../features.json";
import PublishLadder from "./PublishLadder";
import "./Sidebar.css";

type SidebarProps = {
	visible: boolean;
};

const Sidebar = ({ visible }: SidebarProps) => (
	<section
		className={`Sidebar ${
			visible ? "sidebar-mobile-visible" : "sidebar-mobile-hidden"
		}`}
		style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
	>
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/create">Create a New Ladder</Link>
				</li>
				<li>
					<Link to="/ladders">View Existing Ladders</Link>
				</li>
			</ul>
		</nav>
		{features.publishLadder ? <PublishLadder /> : ""}
	</section>
);

export default Sidebar;
