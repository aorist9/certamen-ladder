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
		<g id="SVGRepo_bgCarrier" strokeWidth="0" />
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<g id="SVGRepo_iconCarrier">
			<path
				d="M4 18L20 18"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M4 12L20 12"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M4 6L20 6"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</g>
	</svg>
);

export default HamburgerIcon;
