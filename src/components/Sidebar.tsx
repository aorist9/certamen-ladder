import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

type SidebarProps = {
	visible: boolean;
};

const Sidebar = ({ visible }: SidebarProps) => (
	<nav
		className={`Sidebar ${
			visible ? "sidebar-mobile-visible" : "sidebar-mobile-hidden"
		}`}
	>
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
);

export default Sidebar;
