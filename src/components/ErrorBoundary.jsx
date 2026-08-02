import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ladderService from "../services/ladderService";
import { useNavigate } from "react-router";

class ErrorBoundary extends React.Component {
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
				<Box sx={{ p: 3 }}>
					<Paper
						variant="outlined"
						sx={{ p: 3, bgcolor: "background.paper", borderColor: "divider" }}
					>
						<Stack spacing={2}>
							<Alert severity="error">
								Oh no! An error occurred. If you want to help out, then before
								you refresh to clear this error, take the below information and
								paste it into an email to webmaster@txclassics.org. It may
								include ladder details, so feel free to skip that part if you
								don't want to share it.
							</Alert>
							<Typography
								component="pre"
								sx={{ whiteSpace: "pre-wrap", fontSize: "0.875rem" }}
							>
								{this.state.error.message}
								\n{this.state.error.stack}
								{ladder ? `\n${JSON.stringify(ladder)}` : ""}
							</Typography>
							<Button
								variant="contained"
								onClick={() => {
									this.props.navigate("/");
									this.setState({ error: undefined });
								}}
							>
								Return to home page
							</Button>
						</Stack>
					</Paper>
				</Box>
			);
		} else {
			return this.props.children;
		}
	}
}

const ErrorBoundaryWrapper = ({ children }) => {
	const navigate = useNavigate();
	return <ErrorBoundary navigate={navigate}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryWrapper;
