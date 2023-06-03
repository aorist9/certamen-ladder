import React from "react";

type IconProps = {
	color: string;
};

const HamburgerIcon = (props: IconProps) => (
	// Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools
	<svg
		width="30px"
		height="30px"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g id="SVGRepo_bgCarrier" stroke-width="0" />
		<g
			id="SVGRepo_tracerCarrier"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M4 18L20 18"
				stroke={props.color}
				stroke-width="2"
				stroke-linecap="round"
			/>
			<path
				d="M4 12L20 12"
				stroke={props.color}
				stroke-width="2"
				stroke-linecap="round"
			/>
			<path
				d="M4 6L20 6"
				stroke={props.color}
				stroke-width="2"
				stroke-linecap="round"
			/>
		</g>
	</svg>
);

export default HamburgerIcon;
