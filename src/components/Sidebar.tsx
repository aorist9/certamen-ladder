import React from "react";
import { Link } from "react-router-dom";
import PublishLadder from "./PublishLadder";
import "./Sidebar.css";
import { useFeatureFlags } from "../utils/featureFlagsContext";

type SidebarProps = {
	visible: boolean;
};

const Sidebar = ({ visible }: SidebarProps) => {
	const { publishLadder: publishLadderFlag } = useFeatureFlags();
	return (
		<section
			className={`Sidebar ${
				visible ? "sidebar-mobile-visible" : "sidebar-mobile-hidden"
			}`}
		>
			<section
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center"
				}}
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
				{publishLadderFlag ? <PublishLadder /> : ""}
			</section>
		</section>
	);
};

export default Sidebar;
