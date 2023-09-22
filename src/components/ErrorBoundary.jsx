import React from "react";
import ladderService from "../services/ladderService";

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, errorInfo) {
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.error) {
			const regexResult = /ladder=([^&]+)/.exec(window.location.href);
			const ladderId = regexResult?.length > 1 ? regexResult[1] : undefined;
			let ladder;
			if (ladderId) {
				ladder = ladderService.getLadder(ladderId);
			}
			return (
				<section className="App-page">
					<section className="error">
						Oh no! An error occurred! If you want to help out, then before you
						refresh to clear this error, take the below information and paste it
						into an email to webmaster@txclassics.org. It may include ladder
						details, so feel free to skip that part if you don't want to share
						it.
					</section>
					<p>
						<code>{this.state.error.message}</code>
						<br />
						<code>{this.state.error.stack}</code>
						{ladder ? (
							<p>
								<code>{JSON.stringify(ladder)}</code>
							</p>
						) : (
							""
						)}
					</p>
				</section>
			);
		} else {
			return this.props.children;
		}
	}
}
