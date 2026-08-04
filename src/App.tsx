import React, { useEffect, useMemo, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import useMediaQuery from "@mui/material/useMediaQuery";
import Home from "./routes/Home";
import Sidebar from "./components/Sidebar";
import CreateLadder from "./routes/CreateLadder";
import ViewLadders from "./routes/ViewLadders";
import Draw from "./routes/Draw";
import LadderDisplay from "./routes/LadderDisplay";
import ScoreboardPage from "./routes/ScoreboardPage";
import LadderRow from "./routes/LadderRow";
import ErrorBoundary from "./components/ErrorBoundary";
import ScoreSheet from "./routes/ScoreSheet";
import { FeatureFlagsProvider } from "./contexts/featureFlagsContext";
import { themes } from "./utils/themes";
// @ts-ignore
import "./print.css";

function App() {
	const [themeIndex, setThemeIndex] = useState<number>(() => {
		const stored = window.localStorage.getItem("themeName");
		if (stored) {
			const matchedIndex = themes.findIndex(theme => theme.name === stored);
			return matchedIndex >= 0 ? matchedIndex : 0;
		}
		return 0;
	});
	const [showSidebar, setShowSidebar] = useState<boolean>(false);
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	useEffect(() => {
		if (!window.localStorage.getItem("themeName")) {
			const initialThemeIndex = prefersDarkMode ? 0 : 1;
			setThemeIndex(initialThemeIndex);
		}
	}, [prefersDarkMode]);

	const theme = useMemo(
		() => themes[themeIndex]?.theme ?? themes[0].theme,
		[themeIndex]
	);

	const toggleTheme = () => {
		const nextIndex = (themeIndex + 1) % themes.length;
		window.localStorage.setItem("themeName", themes[nextIndex].name);
		setThemeIndex(nextIndex);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<HashRouter>
				<FeatureFlagsProvider>
					<ErrorBoundary>
						<Box
							sx={{
								display: "flex",
								minHeight: "100vh",
								backgroundColor: theme.palette.background.default
							}}
						>
							<AppBar
								position="fixed"
								elevation={2}
								sx={{
									backgroundColor: theme.palette.background.default,
									color: theme.palette.mode === "light" ? "#0f172a" : "#f8fafc",
									zIndex: theme.zIndex.drawer + 1,
									borderBottom: `1px solid ${theme.palette.divider}`
								}}
							>
								<Toolbar>
									<IconButton
										color="inherit"
										edge="start"
										onClick={() => setShowSidebar(!showSidebar)}
										sx={{ mr: 2, display: { md: "none" } }}
										aria-label="Open navigation drawer"
									>
										<MenuIcon />
									</IconButton>
									<Typography
										variant="h6"
										component="div"
										sx={{ flexGrow: 1, color: "inherit" }}
									>
										Certamen Ladder
									</Typography>
									<IconButton
										color="inherit"
										onClick={toggleTheme}
										sx={{
											color:
												theme.palette.mode === "light" ? "#0f172a" : "#f8fafc"
										}}
										aria-label="Toggle theme"
									>
										{theme.palette.mode === "dark" ? (
											<Brightness7Icon />
										) : (
											<Brightness4Icon />
										)}
									</IconButton>
								</Toolbar>
							</AppBar>
							<Sidebar
								setVisible={setShowSidebar}
								visible={showSidebar}
								onClose={() => setShowSidebar(false)}
							/>
							<Box
								component="main"
								sx={{
									flexGrow: 1,
									p: { xs: 0, md: 3 },
									mt: { xs: 7, sm: 8 },
									backgroundColor: theme.palette.background.paper,
									minHeight: "100vh"
								}}
								onClick={() => setShowSidebar(false)}
							>
								<ErrorBoundary>
									<Routes>
										<Route path="/" element={<Home />} />
										<Route path="/create" element={<CreateLadder />} />
										<Route path="/draw" element={<Draw />} />
										<Route path="/ladder" element={<LadderDisplay />} />
										<Route path="/ladders" element={<ViewLadders />} />
										<Route path="/ladder-row" element={<LadderRow />} />
										<Route path="/scoreboard" element={<ScoreboardPage />} />
										<Route path="/score-sheet" element={<ScoreSheet />} />
									</Routes>
								</ErrorBoundary>
							</Box>
						</Box>
					</ErrorBoundary>
				</FeatureFlagsProvider>
			</HashRouter>
		</ThemeProvider>
	);
}

export default App;
