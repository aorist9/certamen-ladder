import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
	<nav className="Sidebar">
		<ul>
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
